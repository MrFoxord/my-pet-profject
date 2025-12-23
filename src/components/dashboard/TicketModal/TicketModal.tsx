"use client";

import { useMemo, useState } from "react";
import { Ticket, TicketModalProps } from "@/types";
import { Modal } from "@/components/ui/Modal/Modal";
import {
  ModalOuter,
  ModalCard,
  Header,
  HeaderLeft,
  HeaderMetaRow,
  HeaderActions,
  Section,
  SubtasksHeader,
  SubtasksList,
  SubtaskRow,
  CommentsHeader,
  CommentInputRow,
  CommentsList,
  CommentCard,
  CommentHeader,
  DetailsSection,
  RelatedRow,
  EstimatesRow,
  Avatar,
  Typography,
  Button,
  TextField,
  Chip,
  Divider,
  Checkbox,
  LinearProgress,
  MenuItem,
} from "./styled";

const statusOptions: Ticket["status"][] = ["todo", "in-progress", "done"];
const priorityOptions: Ticket["priority"][] = [
  "low",
  "medium",
  "high",
  "critical",
];

// TEMP: frontend-only id, replaced by backend UUID later
const generateId = () => Math.random().toString(36).slice(2);

export const TicketModal = ({ ticket, open, onClose }: TicketModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      {ticket && (
        <TicketModalContent
          key={ticket.id}
          ticket={ticket}
          onClose={onClose}
        />
      )}
    </Modal>
  );
};

interface TicketModalContentProps {
  ticket: Ticket;
  onClose: () => void;
}

const TicketModalContent = ({ ticket, onClose }: TicketModalContentProps) => {
  const [subtasks, setSubtasks] = useState(() => ticket.subtasks ?? []);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(ticket.description);
  const [status, setStatus] = useState<Ticket["status"]>(ticket.status);
  const [priority, setPriority] = useState<Ticket["priority"]>(
    ticket.priority
  );
  const [commentDraft, setCommentDraft] = useState("");
  const [comments, setComments] = useState(ticket.comments ?? []);
  const [estimate, setEstimate] = useState(
    ticket.estimate ?? {
      originalHours: undefined,
      spentHours: undefined,
      remainingHours: undefined,
      storyPoints: undefined,
    }
  );

  const total = subtasks.length;
  const done = useMemo(
    () => subtasks.filter((st) => st.done).length,
    [subtasks]
  );
  const progress = total ? (done / total) * 100 : 0;
  const relatedTickets = ticket.relatedTicketIds ?? [];

  const handleToggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((st) => (st.id === id ? { ...st, done: !st.done } : st))
    );
  };

  const handleStartEdit = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDescription(ticket.description);
    setStatus(ticket.status);
    setPriority(ticket.priority);
    setSubtasks(ticket.subtasks ?? []);
    setComments(ticket.comments ?? []);
    setEstimate(
      ticket.estimate ?? {
        originalHours: undefined,
        spentHours: undefined,
        remainingHours: undefined,
        storyPoints: undefined,
      }
    );
  };

  const handleSave = () => {
    // TODO: отправить изменения на бэкенд / в стор
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
    // TODO: удаление тикета
  };

  return (
    <ModalOuter>
      <ModalCard>
        {/* Шапка */}
        <Header>
          <HeaderLeft>
            <Avatar src={ticket.assignee.avatar} alt={ticket.assignee.name} />
            <div>
              <Typography variant="h6">{ticket.title}</Typography>
              <HeaderMetaRow>
                <Typography variant="body2" color="text.secondary">
                  #{ticket.id}
                </Typography>
                <Chip size="small" label={ticket.type.toUpperCase()} />
                <Chip
                  size="small"
                  label={status.replace("-", " ")}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  size="small"
                  label={`Priority: ${priority}`}
                  color="warning"
                />
              </HeaderMetaRow>
            </div>
          </HeaderLeft>

          <HeaderActions>
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
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Button size="small" variant="text" onClick={onClose}>
              Close
            </Button>
          </HeaderActions>
        </Header>

        <Divider />

        {/* Описание + статус/priority */}
        <Section>
          {isEditing ? (
            <>
              <TextField
                label="Description"
                multiline
                minRows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />
              <EstimatesRow>
                <TextField
                  label="Status"
                  select
                  fullWidth
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as Ticket["status"])
                  }
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
                  onChange={(e) =>
                    setPriority(e.target.value as Ticket["priority"])
                  }
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </EstimatesRow>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Section>

        {/* Подзадачи */}
        <Section>
          <SubtasksHeader>
            <Typography variant="subtitle2">
              Subtasks ({done}/{total})
            </Typography>
            {total > 0 && (
              <Typography variant="caption" color="text.secondary">
                {Math.round(progress)}%
              </Typography>
            )}
          </SubtasksHeader>

          <SubtasksList>
            {subtasks.map((st) => (
              <SubtaskRow key={st.id}>
                <Checkbox
                  checked={st.done}
                  onChange={() => handleToggleSubtask(st.id)}
                  size="small"
                />
                <Typography variant="body2">{st.title}</Typography>
              </SubtaskRow>
            ))}
          </SubtasksList>

          {total > 0 && (
            <LinearProgress variant="determinate" value={progress} />
          )}
        </Section>

        <Divider />

        {/* Комментарии */}
        <Section>
          <CommentsHeader>
            <Typography variant="subtitle2">Discussion</Typography>
            <CommentInputRow>
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
            </CommentInputRow>
          </CommentsHeader>

          <CommentsList>
            {comments.map((comment) => (
              <CommentCard key={comment.id}>
                <CommentHeader>
                  <Avatar
                    src={comment.author.avatar}
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography variant="body2" fontWeight={600}>
                    {comment.author.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.createdAt).toLocaleString()}
                  </Typography>
                </CommentHeader>
                <Typography variant="body2">{comment.message}</Typography>
              </CommentCard>
            ))}
            {comments.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No comments yet. Start the discussion above.
              </Typography>
            )}
          </CommentsList>
        </Section>

        <Divider />

        {/* Estimates */}
        <Section>
          <Typography variant="subtitle2">Estimates</Typography>

          {isEditing ? (
            <EstimatesRow>
              <TextField
                type="number"
                label="Original (hours)"
                fullWidth
                value={estimate.originalHours ?? ""}
                onChange={(e) =>
                  setEstimate((prev) => ({
                    ...prev,
                    originalHours:
                      e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
              />
              <TextField
                type="number"
                label="Spent (hours)"
                fullWidth
                value={estimate.spentHours ?? ""}
                onChange={(e) =>
                  setEstimate((prev) => ({
                    ...prev,
                    spentHours:
                      e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
              />
              <TextField
                type="number"
                label="Remaining (hours)"
                fullWidth
                value={estimate.remainingHours ?? ""}
                onChange={(e) =>
                  setEstimate((prev) => ({
                    ...prev,
                    remainingHours:
                      e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
              />
              <TextField
                type="number"
                label="Story points"
                fullWidth
                value={estimate.storyPoints ?? ""}
                onChange={(e) =>
                  setEstimate((prev) => ({
                    ...prev,
                    storyPoints:
                      e.target.value === "" ? undefined : Number(e.target.value),
                  }))
                }
              />
            </EstimatesRow>
          ) : (
            <DetailsSection>
              <Typography variant="body2" color="text.secondary">
                Original: {estimate.originalHours ?? "—"} h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Spent: {estimate.spentHours ?? "—"} h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Remaining: {estimate.remainingHours ?? "—"} h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Story points: {estimate.storyPoints ?? "—"}
              </Typography>
            </DetailsSection>
          )}
        </Section>

        <Divider />

        {/* Детали тикета */}
        <DetailsSection>
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
            <RelatedRow>
              {relatedTickets.map((id) => (
                <Chip key={id} size="small" label={`#${id}`} />
              ))}
            </RelatedRow>
          )}
        </DetailsSection>
      </ModalCard>
    </ModalOuter>
  );
};