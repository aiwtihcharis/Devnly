import { Project, Slide, AIModelId, UserRole, TeamMember, AppNotification, UserProfile } from "../types";

// --- Types for our Mock DB ---

export interface AnalyticsRecord {
    id: string;
    deckId: string;
    viewer: string;
    action: 'View' | 'Click' | 'Conversion';
    timestamp: Date;
}

// --- Mock Data Store ---

let currentUser: UserProfile | null = null;

// Initialize as empty for production-ready feel
let projects: Project[] = [];

// Initialize as empty
let analyticsLogs: AnalyticsRecord[] = [];

// Team Members - Empty by default
let teamMembers: TeamMember[] = [];

// Notifications
let notifications: AppNotification[] = [];

// --- Listener System ---
type Listener = () => void;
let listeners: Listener[] = [];

const notifyListeners = () => {
    listeners.forEach(l => l());
};

// --- Service Methods ---

export const MockFirebase = {
    subscribe: (listener: Listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    },

    auth: {
        // Updated signature to accept password (ignored in mock)
        login: async (email: string, password?: string) => {
            return new Promise<UserProfile>((resolve) => {
                setTimeout(() => {
                    currentUser = {
                        id: 'u1',
                        name: 'Alex Designer',
                        email: email,
                        role: UserRole.ADMIN,
                        avatar: 'https://ui-avatars.com/api/?name=Alex+Designer&background=f97316&color=fff',
                        workspaceName: 'Acme Creative'
                    };
                    // Add Welcome Notification if first login
                    if (notifications.length === 0) {
                         notifications.push({
                             id: 'n-welcome',
                             title: 'Welcome to Devdecks',
                             message: 'Your workspace is ready. Invite your team to get started.',
                             timestamp: new Date(),
                             read: false,
                             type: 'success'
                         });
                         notifyListeners();
                    }
                    resolve(currentUser);
                }, 300); // Reduced delay
            });
        },
        // Updated signature to accept password
        signup: async (email: string, password?: string, name: string = 'New User') => {
            return new Promise<UserProfile>((resolve) => {
                setTimeout(() => {
                    currentUser = {
                        id: 'u2',
                        name: name,
                        email: email,
                        role: UserRole.ADMIN,
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f97316&color=fff`,
                        workspaceName: 'My Workspace'
                    };
                    resolve(currentUser);
                }, 300); // Reduced delay
            });
        },
        updateProfile: async (updates: Partial<UserProfile>) => {
            if (currentUser) {
                currentUser = { ...currentUser, ...updates };
            }
            return currentUser;
        },
        getCurrentUser: () => currentUser,
    },
    
    db: {
        getProjects: async () => {
            // Simulate network delay
            return new Promise<Project[]>((resolve) => setTimeout(() => resolve([...projects]), 200));
        },
        createProject: async (project: Project) => {
            projects.unshift(project);
            notifications.unshift({
                id: `n-${Date.now()}`,
                title: 'Project Created',
                message: `"${project.title}" has been created successfully.`,
                timestamp: new Date(),
                read: false,
                type: 'success'
            });
            notifyListeners();
            return project;
        },
        updateProject: async (id: string, updates: Partial<Project>) => {
            const idx = projects.findIndex(p => p.id === id);
            if (idx !== -1) {
                projects[idx] = { ...projects[idx], ...updates, updatedAt: new Date() };
                notifyListeners();
            }
            return projects[idx];
        },
        getAnalytics: async () => {
            return new Promise<AnalyticsRecord[]>((resolve) => setTimeout(() => resolve([...analyticsLogs]), 200));
        },
        logEvent: async (record: AnalyticsRecord) => {
            analyticsLogs.unshift(record);
            notifyListeners();
        },
        // Team Management
        getTeamMembers: async () => {
             return new Promise<TeamMember[]>((resolve) => setTimeout(() => resolve([...teamMembers]), 150));
        },
        inviteMember: async (email: string, role: string) => {
            return new Promise<TeamMember>((resolve) => {
                setTimeout(() => {
                    const newMember: TeamMember = {
                        id: `tm-${Date.now()}`,
                        name: email.split('@')[0], // Simple mock name
                        email: email,
                        role: role,
                        status: 'Invited',
                        avatar: `bg-${['emerald', 'blue', 'amber', 'purple', 'rose'][Math.floor(Math.random() * 5)]}-500`
                    };
                    teamMembers.push(newMember);
                    
                    // Add notification
                    notifications.unshift({
                        id: `n-${Date.now()}`,
                        title: 'Member Invited',
                        message: `${email} has been invited to the workspace as ${role}.`,
                        timestamp: new Date(),
                        read: false,
                        type: 'info'
                    });
                    
                    notifyListeners();
                    resolve(newMember);
                }, 300); // Reduced delay
            });
        },
        // Notifications
        getNotifications: async () => {
             return new Promise<AppNotification[]>((resolve) => resolve([...notifications]));
        },
        markNotificationAsRead: async (id: string) => {
            const n = notifications.find(n => n.id === id);
            if (n) {
                n.read = true;
                notifyListeners();
            }
        },
        markAllNotificationsAsRead: async () => {
            notifications.forEach(n => n.read = true);
            notifyListeners();
        }
    }
};