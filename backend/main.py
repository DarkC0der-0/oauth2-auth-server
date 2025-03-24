from fastapi import FastAPI, Depends
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
from prometheus_client import start_http_server, Summary
from prometheus_client.exposition import generate_latest
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from utils.redis import redis_client
from auth import routes as auth_routes
from models import user as models
from utils.database import engine
from middleware.rbac import role_checker, permission_checker
from middleware.audit_log import audit_log_middleware
import time
import logging

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Start Prometheus metrics server
start_http_server(8001)

# Create a metric to track time spent and requests made.
REQUEST_TIME = Summary('request_processing_seconds', 'Time spent processing request')

class PrometheusMiddleware(BaseHTTPMiddleware):
    @REQUEST_TIME.time()
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers['X-Process-Time'] = str(process_time)
        return response

app.add_middleware(PrometheusMiddleware)

@app.on_event("startup")
async def startup():
    await FastAPILimiter.init(redis_client)

app.middleware('http')(audit_log_middleware)

@app.include_router(auth_routes.router)

@app.get("/admin-route")
def admin_route(current_user: models.User = Depends(role_checker(["admin"]))):
    return {"message": "This route is for admin users only"}

@app.get("/editor-route")
def editor_route(current_user: models.User = Depends(role_checker(["admin", "editor"]))):
    return {"message": "This route is for admin and editor users"}

@app.get("/viewer-route")
def viewer_route(current_user: models.User = Depends(permission_checker(["view_content"]))):
    return {"message": "This route is for users with view content permission"}

@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type='text/plain')