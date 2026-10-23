import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Paper,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Tabs,
    Tab
} from '@mui/material'
import { ArrowBack, CalendarToday, LocationOn, Schedule } from '@mui/icons-material'
import SheetList from './components/SheetList'
import type { Sheet } from './App'

export interface AgendaItem {
    time?: string
    title: string
    description?: string
}

export interface EventDetails {
    id: string
    bandId: string
    title: string
    date: string
    time: string
    description: string
    location: string
    agenda: AgendaItem[]
    group_keys: string[]
    tags?: string[]
}


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

async function getSheets(bandId: string | undefined, titles: string[]): Promise<Sheet[]> {
    const queryParams = new URLSearchParams()
    titles.forEach((title) => queryParams.append('group_key', title))

    const queryString = queryParams.toString()
    const url = `/api/bands/${bandId}/sheets${queryString ? `?${queryString}` : ''}`

    return fetch(url, {
        method: 'GET'
    })
        .then(res => res.json() as Promise<Sheet[]>)
}

function Event() {
    const { bandId, eventId } = useParams<{ bandId: string; eventId: string }>()
    const [event, setEvent] = useState<EventDetails | null>(null)
    const [sheets, setSheets] = useState<Sheet[]>([])
    const [loading, setLoading] = useState(true)
    const [tabValue, setTabValue] = useState(0)

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue)
    }

    useEffect(() => {
        fetch(`/api/events/${eventId}`)
            .then(res => res.json())
            .then(async (eventData) => {
                const sheetsData = await getSheets(bandId, eventData.group_keys ?? [])
                setEvent(eventData)
                setSheets(sheetsData)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [bandId, eventId])

    if (loading) {
        return (
            <Box sx={{ padding: 2 }}>
                <Typography>Loading event details...</Typography>
            </Box>
        )
    }

    if (!event) {
        return (
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Event Not Found
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    The event you're looking for doesn't exist or has been removed.
                </Typography>
                <Button
                    component={Link}
                    to={`/bands/${bandId}/events`}
                    variant="contained"
                    startIcon={<ArrowBack />}
                >
                    Back to Events
                </Button>
            </Box>
        )
    }

    return (
        <>
            <Box sx={{ mb: 2 }}>
                <Button
                    component={Link}
                    to={`/bands/${bandId}/events`}
                    startIcon={<ArrowBack />}
                    sx={{ mb: 2 }}
                >
                    Back to Events
                </Button>
            </Box>

            <Typography variant="h2" component="h1" gutterBottom>
                {event.title}
            </Typography>

            <Paper elevation={0}>
                <Card>
                    <CardContent sx={{ padding: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                            <CalendarToday color="primary" />
                            <Typography variant="h6">
                                {new Date(event.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                            <Schedule color="primary" />
                            <Typography variant="h6">
                                {event.time}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                            <LocationOn color="primary" />
                            <Typography variant="h6">
                                {event.location}
                            </Typography>
                        </Box>

                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="event details tabs">
                                <Tab label="Description" {...a11yProps(0)} />
                                <Tab label="Agenda" {...a11yProps(1)} />
                                <Tab label="Music Sheets" {...a11yProps(2)} />
                            </Tabs>
                        </Box>

                        <TabPanel value={tabValue} index={0}>
                            <Typography variant="body1">
                                {event.description}
                            </Typography>

                            {event.tags && event.tags.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Tags
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {event.tags.map((tag, index) => (
                                            <Chip key={index} label={tag} variant="outlined" />
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <List sx={{ pt: 0 }}>
                                {event.agenda.map((item, index) => (
                                    <ListItem key={index} sx={{ pl: 0 }}>
                                        <ListItemIcon>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: '50%',
                                                    backgroundColor: 'primary.main',
                                                    color: 'primary.contrastText',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {index + 1}
                                            </Box>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    {item.time && (
                                                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: '60px' }} hidden>
                                                            {item.time}
                                                        </Typography>
                                                    )}
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {item.title}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={item.description}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </TabPanel>

                        <TabPanel value={tabValue} index={2}>
                            <SheetList sheets={sheets} />
                        </TabPanel>
                    </CardContent>
                </Card>
            </Paper>
        </>
    )
}

export default Event