from redis import Redis

redis_client = Redis(host='redis', port=6379, db=1)

def get_cached_data(key: str):
    return redis_client.get(key)

def set_cached_data(key: str, value, ex: int = 300):
    redis_client.set(key, value, ex)