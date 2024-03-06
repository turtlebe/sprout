import { Delete, Edit } from '@material-ui/icons';
import {
  DialogConfirmation,
  getDialogConfirmationDataTestIds,
} from '@plentyag/brand-ui/src/components/dialog-confirmation';
import { Show } from '@plentyag/brand-ui/src/components/show';
import { Avatar, Box, IconButton, Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { Comment } from '@plentyag/core/src/types';
import { DateTimeFormat, getScopedDataTestIds } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

import { UseCommentsApiReturn } from '../../hooks';
import { getTextAreaCommentDataTestIds, TextAreaComment } from '../text-area-comment';

import { useStyles } from './styles';

const dataTestIds = getScopedDataTestIds(
  {
    avatar: 'avatar',
    username: 'username',
    createdAt: 'created-at',
    editButton: 'edit-button',
    deleteButton: 'delete-button',
    edited: 'edited',
    dialogConfirmation: getDialogConfirmationDataTestIds('confirmation'),
    content: 'content',
    editArea: getTextAreaCommentDataTestIds('edit-area'),
  },
  'ListItemComment'
);

export { dataTestIds as dataTestIdsListItemComment };

export const geListItemCommentDataTestIds = (prefix = '') => getScopedDataTestIds(dataTestIds, prefix);

export interface ListItemComment {
  comment: Comment;
  onUpdate: UseCommentsApiReturn['handleUpdateComment'];
  onDelete: UseCommentsApiReturn['handleDeleteComment'];
  immutable?: boolean;
  renderContext?: (comment: Comment) => React.ReactNode;
  'data-testid'?: string;
}

export const ListItemComment = React.forwardRef<HTMLDivElement, ListItemComment>(
  ({ comment: commentProp, onDelete, onUpdate, renderContext, immutable, 'data-testid': dataTestId }, ref) => {
    const dataTestIdsWithPrefix = geListItemCommentDataTestIds(dataTestId);
    const classes = useStyles({});
    const [coreStore] = useCoreStore();
    const [comment, setComment] = React.useState<Comment>(commentProp);
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
    const [isUpdating, setIsUpdating] = React.useState<boolean>(false);

    const handleUpdateComment: TextAreaComment['onSubmit'] = comment => {
      setIsUpdating(true);
      onUpdate(comment, () => {
        setIsEditing(false);
        setIsUpdating(false);
      });
    };

    const handleDeleteComment: DialogConfirmation['onConfirm'] = () => {
      onDelete(comment, () => setIsDeleting(false));
    };

    return (
      <div ref={ref} id={comment.id} style={{ display: 'flex', flexDirection: 'column', gridGap: '0.5rem' }}>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center" gridGap="0.5rem">
            <Avatar className={classes.avatar} data-testid={dataTestIdsWithPrefix.avatar}>
              {comment.createdBy[0].toUpperCase()}
            </Avatar>
            <Typography
              variant="subtitle2"
              color="textPrimary"
              className={classes.username}
              data-testid={dataTestIdsWithPrefix.username}
            >
              {comment.createdBy}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" data-testid={dataTestIdsWithPrefix.createdAt}>
              {DateTime.fromISO(comment.createdAt).toFormat(DateTimeFormat.US_DEFAULT)}
            </Typography>
            <Show when={comment.createdAt !== comment.updatedAt}>
              <Tooltip title={DateTime.fromISO(comment.updatedAt).toFormat(DateTimeFormat.US_DEFAULT)}>
                <Typography variant="subtitle2" color="textSecondary" data-testid={dataTestIdsWithPrefix.edited}>
                  (edited)
                </Typography>
              </Tooltip>
            </Show>
            <Show when={!immutable && !isEditing && coreStore.currentUser.username === comment.createdBy}>
              <Box>
                <IconButton
                  icon={Edit}
                  color="default"
                  size="small"
                  iconFontSize="small"
                  onClick={() => setIsEditing(true)}
                  data-testid={dataTestIdsWithPrefix.editButton}
                />
                <IconButton
                  icon={Delete}
                  color="default"
                  size="small"
                  iconFontSize="small"
                  onClick={() => setIsDeleting(true)}
                  data-testid={dataTestIdsWithPrefix.deleteButton}
                />
              </Box>
            </Show>
          </Box>
          {renderContext && renderContext(comment)}
        </Box>
        <Show when={isEditing} fallback={<Box data-testid={dataTestIdsWithPrefix.content}>{comment.content}</Box>}>
          <TextAreaComment
            comment={comment}
            onChange={setComment}
            onSubmit={handleUpdateComment}
            onCancel={() => setIsEditing(false)}
            data-testid={dataTestIdsWithPrefix.editArea.root}
            disabled={isUpdating}
          />
        </Show>
        <DialogConfirmation
          open={isDeleting}
          onConfirm={handleDeleteComment}
          onCancel={() => setIsDeleting(false)}
          title="Are you sure you'd like to delete this comment?"
          data-testid={dataTestIdsWithPrefix.dialogConfirmation.root}
        />
      </div>
    );
  }
);
