import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import QRCode from 'qrcode.react';
import mfaService from '../services/mfaService';

const MfaManagement = () => {
    const [mfaEnabled, setMfaEnabled] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [otp, setOtp] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchMfaStatus();
    }, []);

    const fetchMfaStatus = async () => {
        const result = await mfaService.getMfaStatus();
        setMfaEnabled(result.mfa_enabled);
    };

    const handleEnableMfa = async () => {
        const result = await mfaService.enableMfa();
        setQrCodeUrl(result.qr_code_url);
        setOpen(true);
    };

    const handleVerifyOtp = async () => {
        const result = await mfaService.verifyOtp(otp);
        if (result.success) {
            setMfaEnabled(true);
            setOpen(false);
        }
    };

    const handleDisableMfa = async () => {
        await mfaService.disableMfa();
        setMfaEnabled(false);
    };

    return (
        <Container>
            <Typography variant="h6" gutterBottom>
                Multi-Factor Authentication
            </Typography>
            {mfaEnabled ? (
                <div>
                    <Typography variant="body1">MFA is enabled</Typography>
                    <Button variant="contained" color="secondary" onClick={handleDisableMfa}>
                        Disable MFA
                    </Button>
                </div>
            ) : (
                <div>
                    <Typography variant="body1">MFA is not enabled</Typography>
                    <Button variant="contained" color="primary" onClick={handleEnableMfa}>
                        Enable MFA
                    </Button>
                </div>
            )}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Setup MFA</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">Scan the QR code with your authenticator app</Typography>
                    {qrCodeUrl && <QRCode value={qrCodeUrl} />}
                    <TextField
                        label="Enter OTP"
                        fullWidth
                        margin="normal"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleVerifyOtp} color="primary">
                        Verify
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MfaManagement;