import { useState, useEffect } from 'react'
import { Paper, Typography, Box, Card, CardContent, CardActions, Button } from '@mui/material'
import { Link } from 'react-router-dom'

export interface Event {
    id: string
    title: string
    date: string
    description: string
    location: string
}

function Events() {
    const [events, setEvents] = useState<Event[]>([])

    useEffect(() => {
        fetch(`/api/events`)
            .then(res => res.json())
            .then(data => setEvents(data as Event[]))
            .catch((res) => console.error('Failed to fetch events:', res))
    }, [])

    return (
        <>
            <Typography variant="h2" component="h1" gutterBottom>
                Events
            </Typography>

            <Paper elevation={0}>
                <Box sx={{ padding: 2 }}>
                    {events.length === 0 ? (
                        <Typography variant="body1">No events found.</Typography>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {events.map((event) => (
                                <Card key={event.id} sx={{ minWidth: 275 }}>
                                    <CardContent>
                                        <Typography variant="h5" component="div" gutterBottom>
                                            {event.title}
                                        </Typography>
                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                            {new Date(event.date).toLocaleDateString()} • {event.location}
                                        </Typography>
                                        <Typography variant="body2">
                                            {event.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            component={Link}
                                            to={`/events/${event.id}`}
                                        >
                                            View Details
                                        </Button>
                                    </CardActions>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Box>
            </Paper>
        </>
    )
}

export default Events