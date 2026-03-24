"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Ticket, TicketModalProps, TicketAccessPolicy, DEFAULT_ACCESS_POLICY, TicketEstimate } from "@/types";
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

export const TicketModal = ({
  ticket,
  open,
  onClose,
  remoteUpdateVersion,
  boardRoleNames = [],
  currentUserRole,
  currentUserCustomRoleName,
  onSaveTicket,
  onCreateComment,
  onDeleteTicket,
}: TicketModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      {ticket && (
        <TicketModalContent
          key={ticket.id}
          ticket={ticket}
          boardRoleNames={boardRoleNames}
          remoteUpdateVersion={remoteUpdateVersion}
          currentUserRole={currentUserRole}
          currentUserCustomRoleName={currentUserCustomRoleName}
          onSaveTicket={onSaveTicket}
          onCreateComment={onCreateComment}
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
  remoteUpdateVersion?: number;
  currentUserRole?: string | null;
  currentUserCustomRoleName?: string | null;
  onSaveTicket?: (
    ticketId: string,
    payload: {
      description?: string;
      status?: Ticket["status"];
      priority?: Ticket["priority"];
      type?: Ticket["type"];
      estimate?: TicketEstimate;
      accessPolicy?: TicketAccessPolicy;
    }
  ) => Promise<Ticket | null>;
  onCreateComment?: (ticketId: string, body: string) => Promise<{ id: string; author: { name: string; avatar: string }; message: string; createdAt: string } | null>;
  onDeleteTicket?: (ticketId: string) => Promise<boolean>;
  onClose: () => void;
}

const TicketModalContent = ({
  ticket,
  boardRoleNames,
  remoteUpdateVersion,
  currentUserRole,
  currentUserCustomRoleName,
  onSaveTicket,
  onCreateComment,
  onDeleteTicket,
  onClose,
}: TicketModalContentProps) => {
  type PulseSection = "work" | "subtasks" | "discussion" | "estimates" | "access";

  const t = useTranslations("ticketModal");
  const format = useFormatter();
  const canManageTicketAccess = currentUserRole === "OWNER" || currentUserRole === "ADMIN";
  const [subtasks, setSubtasks] = useState(() => ticket.subtasks ?? []);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingEstimate, setIsSavingEstimate] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [isRemotePulse, setIsRemotePulse] = useState(false);
  const [description, setDescription] = useState(ticket.description);
  const [status, setStatus] = useState<Ticket["status"]>(ticket.status);
  const [type, setType] = useState<Ticket["type"]>(ticket.type);
  const [priority, setPriority] = useState<Ticket["priority"]>(ticket.priority);
  const [accessPolicy, setAccessPolicy] = useState<TicketAccessPolicy>(
    ticket.accessPolicy ?? DEFAULT_ACCESS_POLICY
  );
  const [commentDraft, setCommentDraft] = useState("");
  const [comments, setComments] = useState(ticket.comments ?? []);
  const [newCommentIds, setNewCommentIds] = useState<Record<string, true>>({});
  const knownCommentIdsRef = useRef<Set<string>>(new Set((ticket.comments ?? []).map((comment) => comment.id)));
  const commentAnimationTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [sectionPulse, setSectionPulse] = useState<Record<PulseSection, boolean>>({
    work: false,
    subtasks: false,
    discussion: false,
    estimates: false,
    access: false,
  });
  const sectionPulseTimeoutsRef = useRef<Record<PulseSection, ReturnType<typeof setTimeout> | undefined>>({
    work: undefined,
    subtasks: undefined,
    discussion: undefined,
    estimates: undefined,
    access: undefined,
  });
  const previousTicketRef = useRef<Ticket>(ticket);
  const [estimate, setEstimate] = useState(
    ticket.estimate ?? {
      originalHours: undefined,
      spentHours: undefined,
      remainingHours: undefined,
      storyPoints: undefined,
    }
  );

  const triggerNewCommentsAnimation = useCallback((commentIds: string[]) => {
    if (!commentIds.length) {
      return;
    }

    setNewCommentIds((prev) => {
      const next = { ...prev };
      commentIds.forEach((id) => {
        next[id] = true;
      });
      return next;
    });

    commentIds.forEach((id) => {
      const activeTimeout = commentAnimationTimeoutsRef.current[id];
      if (activeTimeout) {
        clearTimeout(activeTimeout);
      }
      commentAnimationTimeoutsRef.current[id] = setTimeout(() => {
        setNewCommentIds((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        delete commentAnimationTimeoutsRef.current[id];
      }, 480);
    });
  }, []);

  const applyTicketSnapshot = useCallback((nextTicket: Ticket) => {
    const nextComments = nextTicket.comments ?? [];
    const nextCommentIds = new Set(nextComments.map((comment) => comment.id));
    const addedCommentIds = nextComments
      .map((comment) => comment.id)
      .filter((id) => !knownCommentIdsRef.current.has(id));

    if (isEditing) {
      setComments(nextComments);
      setSubtasks(nextTicket.subtasks ?? []);
      knownCommentIdsRef.current = nextCommentIds;
      triggerNewCommentsAnimation(addedCommentIds);
      return;
    }

    setDescription(nextTicket.description);
    setStatus(nextTicket.status);
    setType(nextTicket.type);
    setPriority(nextTicket.priority);
    setAccessPolicy(nextTicket.accessPolicy ?? DEFAULT_ACCESS_POLICY);
    setSubtasks(nextTicket.subtasks ?? []);
    setComments(nextComments);
    knownCommentIdsRef.current = nextCommentIds;
    triggerNewCommentsAnimation(addedCommentIds);
    setEstimate(
      nextTicket.estimate ?? {
        originalHours: undefined,
        spentHours: undefined,
        remainingHours: undefined,
        storyPoints: undefined,
      }
    );
  }, [isEditing, triggerNewCommentsAnimation]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyTicketSnapshot(ticket);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [applyTicketSnapshot, ticket]);

  useEffect(() => {
    if (!remoteUpdateVersion) {
      return;
    }

    let hidePulseTimeoutId: ReturnType<typeof setTimeout> | undefined;
    const showPulseTimeoutId = setTimeout(() => {
      setIsRemotePulse(true);
      hidePulseTimeoutId = setTimeout(() => setIsRemotePulse(false), 700);
    }, 0);

    return () => {
      clearTimeout(showPulseTimeoutId);
      if (hidePulseTimeoutId) {
        clearTimeout(hidePulseTimeoutId);
      }
    };
  }, [remoteUpdateVersion]);

  const pulseSections = useCallback((sections: PulseSection[]) => {
    if (!sections.length) {
      return;
    }

    setSectionPulse((prev) => {
      const next = { ...prev };
      sections.forEach((section) => {
        next[section] = true;
      });
      return next;
    });

    sections.forEach((section) => {
      const activeTimeout = sectionPulseTimeoutsRef.current[section];
      if (activeTimeout) {
        clearTimeout(activeTimeout);
      }
      sectionPulseTimeoutsRef.current[section] = setTimeout(() => {
        setSectionPulse((prev) => ({ ...prev, [section]: false }));
        sectionPulseTimeoutsRef.current[section] = undefined;
      }, 720);
    });
  }, []);

  useEffect(() => {
    const previousTicket = previousTicketRef.current;

    if (!remoteUpdateVersion) {
      previousTicketRef.current = ticket;
      return;
    }

    const changedSections: PulseSection[] = [];

    if (
      previousTicket.description !== ticket.description ||
      previousTicket.status !== ticket.status ||
      previousTicket.type !== ticket.type ||
      previousTicket.priority !== ticket.priority
    ) {
      changedSections.push("work");
    }

    if (JSON.stringify(previousTicket.subtasks ?? []) !== JSON.stringify(ticket.subtasks ?? [])) {
      changedSections.push("subtasks");
    }

    if (JSON.stringify(previousTicket.comments ?? []) !== JSON.stringify(ticket.comments ?? [])) {
      changedSections.push("discussion");
    }

    if (JSON.stringify(previousTicket.estimate ?? null) !== JSON.stringify(ticket.estimate ?? null)) {
      changedSections.push("estimates");
    }

    if (JSON.stringify(previousTicket.accessPolicy ?? null) !== JSON.stringify(ticket.accessPolicy ?? null)) {
      changedSections.push("access");
    }

    const timeoutId = setTimeout(() => {
      pulseSections(changedSections);
    }, 0);

    previousTicketRef.current = ticket;

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pulseSections, remoteUpdateVersion, ticket]);

  useEffect(() => {
    return () => {
      Object.values(commentAnimationTimeoutsRef.current).forEach((timeoutId) => clearTimeout(timeoutId));
      commentAnimationTimeoutsRef.current = {};
      (Object.values(sectionPulseTimeoutsRef.current) as Array<ReturnType<typeof setTimeout> | undefined>)
        .filter(Boolean)
        .forEach((timeoutId) => clearTimeout(timeoutId));
      sectionPulseTimeoutsRef.current = {
        work: undefined,
        subtasks: undefined,
        discussion: undefined,
        estimates: undefined,
        access: undefined,
      };
    };
  }, []);

  const total = subtasks.length;
  const done = useMemo(
    () => subtasks.filter((st) => st.done).length,
    [subtasks]
  );
  const progress = total ? (done / total) * 100 : 0;
  const relatedTickets = ticket.relatedTicketIds ?? [];

  const effectiveRoles = useMemo(() => {
    const roles = new Set<string>();
    if (currentUserRole) {
      roles.add(currentUserRole.toLowerCase());
    }
    if (currentUserCustomRoleName?.trim()) {
      roles.add(currentUserCustomRoleName.trim().toLowerCase());
    }
    return roles;
  }, [currentUserCustomRoleName, currentUserRole]);

  const hasPermission = (permission: keyof TicketAccessPolicy) => {
    if (canManageTicketAccess) {
      return true;
    }

    const roles = accessPolicy[permission] ?? [];
    if (!roles.length) {
      return true;
    }

    return roles.some((role) => effectiveRoles.has(role.toLowerCase()));
  };

  const canFillTicket = hasPermission("fill");
  const canEditStructure = hasPermission("edit");
  const canEstimateTicket = hasPermission("estimate");
  const canCommentTicket = hasPermission("comment");
  const canDeleteTicket = hasPermission("delete");
  const canOpenEditor = canFillTicket || canEditStructure || canManageTicketAccess;

  const effectivePermissions = [
    canManageTicketAccess ? t("permAccessManagement") : null,
    hasPermission("view") ? t("permView") : null,
    canFillTicket ? t("permFill") : null,
    canEditStructure ? t("permEdit") : null,
    canEstimateTicket ? t("permEstimate") : null,
    canCommentTicket ? t("permComment") : null,
    canDeleteTicket ? t("permDelete") : null,
  ].filter(Boolean) as string[];

  const accessPolicyLabels = [
    { key: "view", label: t("viewLabel"), roles: accessPolicy.view },
    { key: "fill", label: t("fillLabel"), roles: accessPolicy.fill },
    { key: "edit", label: t("editLabel"), roles: accessPolicy.edit },
    { key: "estimate", label: t("estimateLabel"), roles: accessPolicy.estimate },
    { key: "comment", label: t("commentLabel"), roles: accessPolicy.comment },
    { key: "delete", label: t("deleteLabel"), roles: accessPolicy.delete },
  ];

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
    setAccessPolicy(ticket.accessPolicy ?? DEFAULT_ACCESS_POLICY);
    setSubtasks(ticket.subtasks ?? []);
    setComments(ticket.comments ?? []);
    knownCommentIdsRef.current = new Set((ticket.comments ?? []).map((comment) => comment.id));
    setNewCommentIds({});
  };

  const handleSave = async () => {
    if (!onSaveTicket) {
      setIsEditing(false);
      return;
    }

    const payload: {
      description?: string;
      status?: Ticket["status"];
      priority?: Ticket["priority"];
      type?: Ticket["type"];
      accessPolicy?: TicketAccessPolicy;
    } = {
      ...(canFillTicket ? { description, priority, type } : {}),
      ...(canEditStructure ? { status } : {}),
      ...(canManageTicketAccess ? { accessPolicy } : {}),
    };

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    const updated = await onSaveTicket(ticket.id, payload);
    setIsSaving(false);
    if (updated) setIsEditing(false);
  };

  const handleSaveEstimate = async () => {
    if (!onSaveTicket || !canEstimateTicket) {
      return;
    }

    setIsSavingEstimate(true);
    const updated = await onSaveTicket(ticket.id, { estimate });
    setIsSavingEstimate(false);

    if (updated?.estimate) {
      setEstimate(updated.estimate);
    }
    if (updated?.comments) {
      setComments(updated.comments);
    }
  };

  const handleAddComment = async () => {
    const body = commentDraft.trim();
    if (!body || !canCommentTicket) {
      return;
    }

    if (!onCreateComment) {
      return;
    }

    setIsSendingComment(true);
    const created = await onCreateComment(ticket.id, body);
    setIsSendingComment(false);
    if (!created) {
      return;
    }

    triggerNewCommentsAnimation([created.id]);
    setComments((prev) => [created, ...prev]);
    knownCommentIdsRef.current.add(created.id);
    setCommentDraft("");
  };

  const handleDelete = async () => {
    if (!onDeleteTicket) return;
    if (!canDeleteTicket) return;
    const confirmed = window.confirm(t("deleteConfirm"));
    if (!confirmed) return;
    setIsDeleting(true);
    const ok = await onDeleteTicket(ticket.id);
    setIsDeleting(false);
    if (ok) onClose();
  };

  return (
    <ModalOuter>
      <ModalCard $isRemotePulse={isRemotePulse}>
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
                  label={t("priority", { priority })}
                  color="warning"
                />
              </HeaderMetaRow>

              {/* Access policy — always visible */}
              <AccessRolesRow>
                <Typography variant="caption" color="text.secondary">
                  {t("rights")}&nbsp;
                </Typography>
                {accessPolicyLabels.some((item) => item.roles.length > 0) ? (
                  accessPolicyLabels.flatMap((item) =>
                    item.roles.map((role) => (
                      <Chip
                        key={`${item.key}-${role}`}
                        size="small"
                        label={`${item.label}: ${role}`}
                        variant="outlined"
                      />
                    ))
                  )
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    {t("noRestrictions")}
                  </Typography>
                )}
              </AccessRolesRow>

              <AccessRolesRow>
                <Typography variant="caption" color="text.secondary">
                  {t("yourRights")}&nbsp;
                </Typography>
                {effectivePermissions.length > 0 ? (
                  effectivePermissions.map((permission) => (
                    <Chip key={permission} size="small" label={permission} color="primary" variant="outlined" />
                  ))
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    {t("viewOnly")}
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
                  {t("cancel")}
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? t("saving") : t("save")}
                </Button>
              </>
            ) : canOpenEditor ? (
              <Button size="small" variant="outlined" onClick={handleStartEdit}>
                {t("edit")}
              </Button>
            ) : null}
            {canDeleteTicket ? (
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? t("deleting") : t("delete")}
              </Button>
            ) : null}
            <Button size="small" variant="text" onClick={onClose}>
              {t("close")}
            </Button>
          </HeaderActions>
        </Header>

        <Divider />

        {/* ── Work ─────────────────────────────────────────────────────── */}
        <Section $isRemotePulse={sectionPulse.work}>
          <Typography variant="subtitle2">{t("sectionWork")}</Typography>
          {isEditing ? (
            <>
              <TextField
                label="Description"
                multiline
                minRows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!canFillTicket}
                fullWidth
              />
              <EstimatesRow>
                <TicketStatusSelect value={status} onChange={setStatus} disabled={!canEditStructure} />
                <TicketTypeSelect value={type} onChange={setType} disabled={!canFillTicket} />
                <TicketPrioritySelect value={priority} onChange={setPriority} disabled={!canFillTicket} />
              </EstimatesRow>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Section>

        {/* ── Subtasks ──────────────────────────────────────────────────── */}
        <Section $isRemotePulse={sectionPulse.subtasks}>
          <SubtasksHeader>
            <Typography variant="subtitle2">
              {t("sectionSubtasks", { done, total })}
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

        {/* ── Discussion ────────────────────────────────────────────────── */}
        <Section $isRemotePulse={sectionPulse.discussion}>
          <CommentsHeader>
            <Typography variant="subtitle2">{t("sectionDiscussion")}</Typography>
            <CommentInputRow>
              <TextField
                fullWidth
                size="small"
                placeholder={canCommentTicket ? t("commentPlaceholder") : t("noCommentPermission")}
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                disabled={!canCommentTicket || isSendingComment}
              />
              <Button
                variant="contained"
                onClick={() => void handleAddComment()}
                disabled={!canCommentTicket || !commentDraft.trim() || isSendingComment}
              >
                {isSendingComment ? t("sending") : t("send")}
              </Button>
            </CommentInputRow>
          </CommentsHeader>

          <CommentsList>
            {comments.map((comment) => (
              <CommentCard key={comment.id} $isNew={Boolean(newCommentIds[comment.id])}>
                <CommentHeader>
                  {comment.message.startsWith("Estimate updated:") ? (
                    <Chip size="small" color="info" variant="outlined" label={t("estimateLog")} />
                  ) : null}
                  <Avatar
                    src={comment.author.avatar}
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography variant="body2" fontWeight={600}>
                    {comment.author.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format.dateTime(new Date(comment.createdAt), { dateStyle: "medium", timeStyle: "short" })}
                  </Typography>
                </CommentHeader>
                <Typography variant="body2">{comment.message}</Typography>
              </CommentCard>
            ))}
            {comments.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                {t("noComments")}
              </Typography>
            )}
          </CommentsList>
        </Section>

        <Divider />

        {/* ── Estimates ─────────────────────────────────────────────────── */}
        <Section $isRemotePulse={sectionPulse.estimates}>
          <Typography variant="subtitle2">{t("sectionEstimates")}</Typography>

          {canEstimateTicket ? (
            <EstimatesRow>
              <TextField
                type="number"
                label={t("originalHours")}
                fullWidth
                value={estimate.originalHours ?? ""}
                onChange={(e) =>
                  setEstimate((prev) => ({
                    ...prev,
                    originalHours:
                      e.target.value === ""
                        ? null
                        : Number(e.target.value),
                  }))
                }
                disabled={isSavingEstimate || !onSaveTicket}
              />
              <TextField
                type="number"
                label={t("spentHours")}
                fullWidth
                value={estimate.spentHours ?? ""}
                onChange={(e) =>
                  setEstimate((prev) => ({
                    ...prev,
                    spentHours:
                      e.target.value === ""
                        ? null
                        : Number(e.target.value),
                  }))
                }
                disabled={isSavingEstimate || !onSaveTicket}
              />
              <TextField
                type="number"
                label={t("remainingHours")}
                fullWidth
                value={estimate.remainingHours ?? ""}
                onChange={(e) =>
                  setEstimate((prev) => ({
                    ...prev,
                    remainingHours:
                      e.target.value === ""
                        ? null
                        : Number(e.target.value),
                  }))
                }
                disabled={isSavingEstimate || !onSaveTicket}
              />
              <TextField
                type="number"
                label={t("storyPoints")}
                fullWidth
                value={estimate.storyPoints ?? ""}
                onChange={(e) =>
                  setEstimate((prev) => ({
                    ...prev,
                    storyPoints:
                      e.target.value === ""
                        ? null
                        : Number(e.target.value),
                  }))
                }
                disabled={isSavingEstimate || !onSaveTicket}
              />
              <Button
                variant="contained"
                aria-label={t("saveEstimates")}
                onClick={() => void handleSaveEstimate()}
                disabled={isSavingEstimate || !onSaveTicket}
              >
                {isSavingEstimate ? t("saving") : <SaveOutlinedIcon fontSize="small" />}
              </Button>
            </EstimatesRow>
          ) : (
            <DetailsSection>
              <Typography variant="body2" color="text.secondary">
                {t("originalValue", { hours: estimate.originalHours ?? "\u2014" })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("spentValue", { hours: estimate.spentHours ?? "\u2014" })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("remainingValue", { hours: estimate.remainingHours ?? "\u2014" })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("storyPointsValue", { points: estimate.storyPoints ?? "\u2014" })}
              </Typography>
            </DetailsSection>
          )}
        </Section>

        {canManageTicketAccess ? (
          <>
            <Divider />

            {/* ── Admin ─────────────────────────────────────────────────── */}
            <Section $isRemotePulse={sectionPulse.access}>
              <Typography variant="subtitle2">{t("sectionAdmin")}</Typography>

              {isEditing ? (
                <>
                  <RolesSelect
                    value={accessPolicy.view}
                    onChange={(roles) => setAccessPolicy({ ...accessPolicy, view: roles })}
                    boardRoleNames={boardRoleNames}
                    label={t("viewLabel")}
                  />
                  <RolesSelect
                    value={accessPolicy.fill}
                    onChange={(roles) => setAccessPolicy({ ...accessPolicy, fill: roles })}
                    boardRoleNames={boardRoleNames}
                    label={t("fillLabel")}
                  />
                  <RolesSelect
                    value={accessPolicy.edit}
                    onChange={(roles) => setAccessPolicy({ ...accessPolicy, edit: roles })}
                    boardRoleNames={boardRoleNames}
                    label={t("editLabel")}
                  />
                  <RolesSelect
                    value={accessPolicy.delete}
                    onChange={(roles) => setAccessPolicy({ ...accessPolicy, delete: roles })}
                    boardRoleNames={boardRoleNames}
                    label={t("deleteLabel")}
                  />
                  <RolesSelect
                    value={accessPolicy.estimate}
                    onChange={(roles) => setAccessPolicy({ ...accessPolicy, estimate: roles })}
                    boardRoleNames={boardRoleNames}
                    label={t("estimateLabel")}
                  />
                  <RolesSelect
                    value={accessPolicy.comment}
                    onChange={(roles) => setAccessPolicy({ ...accessPolicy, comment: roles })}
                    boardRoleNames={boardRoleNames}
                    label={t("commentLabel")}
                  />
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t("accessRulesHint")}
                </Typography>
              )}
            </Section>
          </>
        ) : null}

        <Divider />

        {/* ── Details ───────────────────────────────────────────────────── */}
        <DetailsSection>
          <Typography variant="subtitle2">{t("sectionDetails")}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t("created", { date: format.dateTime(new Date(ticket.createdAt), { dateStyle: "medium", timeStyle: "short" }) })}
          </Typography>
          {ticket.dueDate && (
            <Typography variant="body2" color="text.secondary">
              {t("due", { date: format.dateTime(new Date(ticket.dueDate), { dateStyle: "medium", timeStyle: "short" }) })}
            </Typography>
          )}
          {ticket.updatedAt && (
            <Typography variant="body2" color="text.secondary">
              {t("updated", { date: format.dateTime(new Date(ticket.updatedAt), { dateStyle: "medium", timeStyle: "short" }) })}
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
