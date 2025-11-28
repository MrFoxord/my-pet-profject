"use client";

import { useMemo, useState } from 'react';
import { Ticket } from '@/types';
import { Modal } from '@/components/ui/Modal/Modal';
import { Box,
    Typography,
    Avatar,
    LinearProgress,
    Checkbox,
    Stack,
    Button,
    TextField,
    Divider,
    Chip,
    MenuItem,
    } from '@mui/material';
import { TicketModalProps } from '@/types';

const statusOptions: Ticket["status"][] = ["todo", "in-progress", "done"];
const priorityOptions: Ticket["priority"][] = ["low", "medium", "high", "critical"];

const generateId = () => Math.random().toString(36).slice(2);

export const TicketModal = ({ticket, open, onClose}: TicketModalProps) =>{
    
    const [subtasks, setSubtasks] = useState(() => ticket?.subtasks ?? []);
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(ticket.description);
    const [status, setStatus] = useState(ticket?.status);
    const [priority, setPriority] = useState(ticket.priority);
    const [commentDraft, setCommentDraft] = useState("");
    const [comments, setComments] = useState(ticket.comments ?? []);


    const total = subtasks.length;
    const done = useMemo(() => subtasks.filter(st => st.done).length, [subtasks]);
    if (!ticket) return null;
    const progress = total ? (done / total) * 100 : 0;
    const relatedTickets = ticket.relatedTicketIds ?? [];

    const handleToggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((st) => (st.id === id ? { ...st, done: !st.done } : st)),
    );
  };

  const handleStartEdit = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDescription(ticket.description);
    setStatus(ticket.status);
    setPriority(ticket.priority);
    setSubtasks(ticket.subtasks);
  };

  const handleSave = () => {
    // TODO: sync changes with backend or state manager
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (!commentDraft.trim()) return;
    setComments((prev) => [
      {
        id: generateId(),
        author: ticket.assignee,
        message: commentDraft.trim(),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setCommentDraft("");
  };

  const handleDelete = () => {
    // TODO: trigger ticket deletion flow
  };
    return (
        <Modal open={open} onClose={onClose}>
            <span>  {ticket.status}</span>
        <Box
          sx={{
            width: "maxContent",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            overflowY: "auto",
            overflowX: "auto",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={ticket.assignee.avatar} alt={ticket.assignee.name} />
              <Box>
                <Typography variant="h6">{ticket.title}</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    #{ticket.id}
                  </Typography>
                  <Chip size="small" label={ticket.type.toUpperCase()} />
                  <Chip size="small" label={status} color="primary" variant="outlined" />
                  <Chip size="small" label={`Priority: ${priority}`} color="warning" />
                </Stack>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
              {isEditing ? (
                <>
                  <Button size="small" variant="outlined" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button size="small" variant="contained" onClick={handleSave}>
                    Save
                  </Button>
                </>
              ) : (
                <Button size="small" variant="outlined" onClick={handleStartEdit}>
                  Edit
                </Button>
              )}
              <Button size="small" color="error" variant="outlined" onClick={handleDelete}>
                Delete
              </Button>
              <Button size="small" variant="text" onClick={onClose}>
                Close
              </Button>
            </Stack>
          </Stack>

          <Divider />

          {isEditing ? (
            <Stack spacing={2}>
              <TextField
                label="Description"
                multiline
                minRows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Status"
                  select
                  fullWidth
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Ticket["status"])}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option.replace("-", " ")}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Priority"
                  select
                  fullWidth
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Ticket["priority"])}
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}

          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2">
                Subtasks ({done}/{total})
              </Typography>
              {total > 0 && (
                <Typography variant="caption" color="text.secondary">
                  {Math.round(progress)}%
                </Typography>
              )}
            </Stack>

            <Stack spacing={1.25} sx={{ mt: 1 }}>
              {subtasks.map((st) => (
                <Stack
                  key={st.id}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ px: 1, py: 0.75, borderRadius: 1, bgcolor: "action.hover" }}
                >
                  <Checkbox
                    checked={st.done}
                    onChange={() => handleToggleSubtask(st.id)}
                    size="small"
                  />
                  <Typography variant="body2">{st.title}</Typography>
                </Stack>
              ))}
            </Stack>

            {total > 0 && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
            )}
          </Box>

          <Divider />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Discussion</Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a comment..."
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddComment}>
                Send
              </Button>
            </Stack>

            <Stack spacing={1}>
              {comments.map((comment) => (
                <Box key={comment.id} sx={{ p: 1.5, borderRadius: 1, bgcolor: "action.hover" }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={comment.author.avatar} sx={{ width: 24, height: 24 }} />
                    <Typography variant="body2" fontWeight={600}>
                      {comment.author.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleString()}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ mt: 0.75 }}>
                    {comment.message}
                  </Typography>
                </Box>
              ))}
              {comments.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No comments yet. Start the discussion above.
                </Typography>
              )}
            </Stack>
          </Stack>

          <Divider />

          <Stack spacing={0.5}>
            <Typography variant="subtitle2">Ticket details</Typography>
            <Typography variant="body2" color="text.secondary">
              Created: {new Date(ticket.createdAt).toLocaleString()}
            </Typography>
            {ticket.dueDate && (
              <Typography variant="body2" color="text.secondary">
                Due: {new Date(ticket.dueDate).toLocaleString()}
              </Typography>
            )}
            {ticket.updatedAt && (
              <Typography variant="body2" color="text.secondary">
                Updated: {new Date(ticket.updatedAt).toLocaleString()}
              </Typography>
            )}
            {!!relatedTickets.length && (
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                {relatedTickets.map((id) => (
                  <Chip key={id} size="small" label={`#${id}`} />
                ))}
              </Stack>
            )}
          </Stack>
        </Box>
    </Modal>
    );
}