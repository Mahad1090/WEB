import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { NextApiRequest } from 'next';

export const initSocket = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join user-specific room
    socket.on('join-user', (userId: string) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Join admin room for admins
    socket.on('join-admin', () => {
      socket.join('admins');
      console.log('Admin joined admin room');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

// Helper functions to emit events
export const emitLeadCreated = (io: SocketIOServer, lead: any) => {
  io.emit('lead-created', lead);
  io.to('admins').emit('lead-created', lead);
};

export const emitLeadUpdated = (io: SocketIOServer, lead: any) => {
  io.emit('lead-updated', lead);
  io.to('admins').emit('lead-updated', lead);
  if (lead.assignedTo) {
    io.to(`user-${lead.assignedTo}`).emit('lead-updated', lead);
  }
};

export const emitLeadDeleted = (io: SocketIOServer, leadId: string) => {
  io.emit('lead-deleted', { leadId });
  io.to('admins').emit('lead-deleted', { leadId });
};

export const emitLeadAssigned = (io: SocketIOServer, lead: any, agentId: string) => {
  io.to(`user-${agentId}`).emit('lead-assigned', lead);
  io.to('admins').emit('lead-assigned', lead);
};

export const emitActivityLogged = (io: SocketIOServer, activity: any, leadId: string) => {
  io.emit('activity-logged', { activity, leadId });
  io.to('admins').emit('activity-logged', { activity, leadId });
};
