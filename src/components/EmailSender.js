import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Grid, CircularProgress } from '@mui/material';
import { sendEmail } from '../services/emailService';

const EmailSender = () => {
    const [emails, setEmails] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [file, setFile] = useState(null);
    const [scheduledTime, setScheduledTime] = useState(''); // New state for scheduling
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [validEmails, setValidEmails] = useState([]);
    const [invalidEmails, setInvalidEmails] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('body', body);
        if (scheduledTime) {
            // Convert datetime-local to Date object
            const date = new Date(scheduledTime);

            // Get the timezone offset in minutes
            const offset = date.getTimezoneOffset();
            const offsetSign = offset > 0 ? "-" : "+"; // Adjust sign for offset
            const offsetHours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
            const offsetMinutes = String(Math.abs(offset) % 60).padStart(2, '0');

            // Format the time to RFC3339 with timezone offset
            const rfc3339Time = `${date.toISOString().slice(0, -1)}${offsetSign}${offsetHours}:${offsetMinutes}`;
            formData.append('scheduled_time', rfc3339Time);
        }
        if (file) {
            formData.append('file', file);
        } else {
            formData.append('emails', emails);
        }

        try {
            const result = await sendEmail(formData);
            setSuccess(result.message);
            setValidEmails(result.valid_emails || []);
            setInvalidEmails(result.invalid_emails || []);
            setError('');
        } catch (err) {
            setError(err.error || 'Failed to send emails');
            setSuccess('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '50px' }}>
            <Box mb={4} display="flex" justifyContent="center" alignItems="center">
                <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#3f51b5' }}>
                    Mass Email Sender with Scheduling
                </Typography>
            </Box>
            <Paper elevation={6} style={{ padding: '20px', borderRadius: '8px' }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Subject"
                                variant="outlined"
                                margin="normal"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Body"
                                variant="outlined"
                                margin="normal"
                                multiline
                                rows={4}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Recipient Emails"
                                variant="outlined"
                                margin="normal"
                                multiline
                                rows={4}
                                placeholder="Enter emails separated by commas or newlines"
                                value={emails}
                                onChange={(e) => setEmails(e.target.value)}
                                disabled={!!file}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" gutterBottom style={{ fontWeight: 'bold', color: '#3f51b5' }}>
                                OR upload a CSV file with email addresses:
                            </Typography>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                style={{
                                    marginBottom: '16px',
                                    padding: '8px',
                                    backgroundColor: '#f1f1f1',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Schedule Emails (Optional)"
                                type="datetime-local"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText="Select a date and time to schedule the email (leave blank to send immediately)"
                            />
                        </Grid>
                        {error && (
                            <Grid item xs={12}>
                                <Typography color="error">{error}</Typography>
                            </Grid>
                        )}
                        {success && (
                            <Grid item xs={12}>
                                <Typography color="primary">{success}</Typography>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : 'Send Emails'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {validEmails.length > 0 && (
                <Box mt={3}>
                    <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#4caf50' }}>
                        Valid Emails:
                    </Typography>
                    <ul>
                        {validEmails.map((email, index) => (
                            <li key={index} style={{ marginBottom: '8px' }}>{email}</li>
                        ))}
                    </ul>
                </Box>
            )}

            {invalidEmails.length > 0 && (
                <Box mt={3}>
                    <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#f44336' }}>
                        Invalid Emails:
                    </Typography>
                    <ul>
                        {invalidEmails.map((email, index) => (
                            <li key={index} style={{ marginBottom: '8px' }}>{email}</li>
                        ))}
                    </ul>
                </Box>
            )}
        </Container>
    );
};

export default EmailSender;
