"use client";

import { useMemo, useState } from "react";
import { Ticket, TicketModalProps } from "@/types";
import {
  Avatar,
  Button,
  Checkbox,
  Chip,
  Divider,
  LinearProgress,
  Modal,
  RolesSelect,
  TextField,
  TicketPrioritySelect,
  TicketStatusSelect,
  TicketTypeSelect,
  Typography,
} from "@/components/ui";
import {
  AccessRolesRow,
  CommentCard,
  CommentHeader,
  CommentInputRow,
  CommentsHeader,
  CommentsList,
  DetailsSection,
  EstimatesRow,
  Header,
  HeaderActions,
  HeaderLeft,
  HeaderMetaRow,
  ModalCard,
  ModalOuter,
  RelatedRow,
  Section,
  SubtaskRow,
  SubtasksList,
  SubtasksHeader,
} from "./styled";

// TEMP: frontend-only id, replaced by backend UUID later
const generateId = () => Math.random().toString(36).slice(2);

export const TicketModal = ({
  ticket,
  open,
  onClose,
  boardRoleNames = [],
  onSaveTicket,
  onDeleteTicket,
}: TicketModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      {ticket && (
        <TicketModalContent
          key={ticket.id}
          ticket={ticket}
          boardRoleNames={boardRoleNames}
          onSaveTicket={onSaveTicket}
          onDeleteTicket={onDeleteTicket}
          onClose={onClose}
        />
      )}
    </Modal>
  );
};

interface TicketModalContentProps {
  ticket: Ticket;
  boardRoleNames: string[];
  onSaveTicket?: (
    ticketId: string,
    payload: {
      description: string;
      status: Ticket["status"];
      priority: Ticket["priority"];
      type: Ticket["type"];
      accessibilityRoles: string[];
    }
  ) => Promise<Ticket | null>;
  onDeleteTicket?: (ticketId: string) => Promise<boolean>;
  onClose: () => void;
}

const TicketModalContent = ({
  ticket,
  boardRoleNames,
  onSaveTicket,
  onDeleteTicket,
  onClose,
}: TicketModalContentProps) => {
  const [subtasks, setSubtasks] = useState(() => ticket.subtasks ?? []);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [description, setDescription] = useState(ticket.description);
  const [status, setStatus] = useState<Ticket["status"]>(ticket.status);
  const [type, setType] = useState<Ticket["type"]>(ticket.type);
  const [priority, setPriority] = useState<Ticket["priority"]>(ticket.priority);
  const [accessibilityRoles, setAccessibilityRoles] = useState<string[]>(
    ticket.accessibilityRoles ?? []
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
    setType(ticket.type);
    setPriority(ticket.priority);
    setAccessibilityRoles(ticket.accessibilityRoles ?? []);
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

  const handleSave = async () => {
    if (!onSaveTicket) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    const updated = await onSaveTicket(ticket.id, {
      description,
      status,
      priority,
      type,
      accessibilityRoles,
    });
    setIsSaving(false);
    if (updated) setIsEditing(false);
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

  const handleDelete = async () => {
    if (!onDeleteTicket) return;
    const confirmed = window.confirm(
      "Удалить тикет? Это действие нельзя отменить."
    );
    if (!confirmed) return;
    setIsDeleting(true);
    const ok = await onDeleteTicket(ticket.id);
    setIsDeleting(false);
    if (ok) onClose();
  };

  return (
    <ModalOuter>
      <ModalCard>
        {/* ── Шапка ─────────────────────────────────────────────────────── */}
        <Header>
          <HeaderLeft>
            <Avatar
              src={ticket.assignee.avatar}
              alt={ticket.assignee.name}
              sx={{ width: 40, height: 40, flexShrink: 0 }}
            />
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

              {/* Роли доступа — видны всегда */}
              <AccessRolesRow>
                <Typography variant="caption" color="text.secondary">
                  Доступ:&nbsp;
                </Typography>
                {accessibilityRoles.length > 0 ? (
                  accessibilityRoles.map((role) => (
                    <Chip
                      key={role}
                      size="small"
                      label={role}
                      variant="outlined"
                    />
                  ))
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    без ограничений
                  </Typography>
                )}
              </AccessRolesRow>
            </div>
          </HeaderLeft>

          <HeaderActions>
            {isEditing ? (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
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
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            <Button size="small" variant="text" onClick={onClose}>
              Close
            </Button>
          </HeaderActions>
        </Header>

        <Divider />

        {/* ── Описание + редактирование ─────────────────────────────────── */}
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
                <TicketStatusSelect value={status} onChange={setStatus} />
                <TicketTypeSelect value={type} onChange={setType} />
                <TicketPrioritySelect value={priority} onChange={setPriority} />
              </EstimatesRow>
              <RolesSelect
                value={accessibilityRoles}
                onChange={setAccessibilityRoles}
                boardRoleNames={boardRoleNames}
                label="Роли доступа"
              />
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Section>

        {/* ── Подзадачи ─────────────────────────────────────────────────── */}
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

        {/* ── Комментарии ───────────────────────────────────────────────── */}
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

        {/* ── Оценки ────────────────────────────────────────────────────── */}
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
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
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
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
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
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
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
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
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

        {/* ── Детали тикета ─────────────────────────────────────────────── */}
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
