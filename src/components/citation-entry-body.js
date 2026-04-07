import { Button } from '@wordpress/components';
import {
	CopyIcon,
	DeleteIcon,
	EditIcon,
	ResetIcon,
	StructuredEditIcon,
} from '../lib/wp-icons';
import { getDisplaySegments } from '../lib/formatting';
import { StructuredCitationEditor } from './structured-citation-editor';

export function CitationEntryBody({
	citation,
	citationWarnings,
	editText,
	editingId,
	getEntryLabel,
	getStructuredFieldId,
	handleDelete,
	handleEntryActivate,
	handleEditConfirm,
	handleEditKeyDown,
	handleEditStart,
	handleCopyCitation,
	handleResetAutoFormat,
	handleStructuredEditCancel,
	handleStructuredEditSave,
	handleStructuredEditStart,
	handleStructuredFieldChange,
	isStructuredEditable,
	onEditTextChange,
	structuredEditingId,
	structuredFields,
}) {
	if (structuredEditingId === citation.id) {
		return (
			<StructuredCitationEditor
				citation={citation}
				fields={structuredFields}
				getStructuredFieldId={getStructuredFieldId}
				onFieldChange={handleStructuredFieldChange}
				onSave={handleStructuredEditSave}
				onCancel={handleStructuredEditCancel}
			/>
		);
	}

	if (editingId === citation.id) {
		return (
			<input
				type="text"
				className="scholarly-bibliography-edit-input"
				value={editText}
				onChange={(event) => onEditTextChange(event.target.value)}
				onKeyDown={handleEditKeyDown}
				onBlur={handleEditConfirm}
				aria-label={`Editing citation: ${getEntryLabel(citation)}`}
				autoFocus // eslint-disable-line jsx-a11y/no-autofocus
			/>
		);
	}

	return (
		<>
			<button
				type="button"
				className="scholarly-bibliography-entry-trigger"
				onClick={handleEntryActivate}
			>
				<div className="scholarly-bibliography-entry-main">
					<span className="scholarly-bibliography-entry-text">
						{getDisplaySegments(citation).map((segment, index) =>
							segment.italic ? (
								<i key={`${citation.id}-${index}`}>
									{segment.text}
								</i>
							) : (
								segment.text
							)
						)}
					</span>
					{citationWarnings.map((warningMessage) => (
						<p
							key={`${citation.id}-${warningMessage}`}
							className="scholarly-bibliography-entry-warning"
						>
							{warningMessage}
						</p>
					))}
				</div>
			</button>
			<span className="scholarly-bibliography-actions">
				{isStructuredEditable && (
					<Button
						label={`Edit fields for ${getEntryLabel(citation)}`}
						showTooltip
						className="scholarly-bibliography-action-button"
						onClick={(event) => {
							event.stopPropagation();
							handleStructuredEditStart(citation.id);
						}}
					>
						<StructuredEditIcon className="scholarly-bibliography-action-icon" />
					</Button>
				)}
				<Button
					label={`Copy citation: ${getEntryLabel(citation)}`}
					showTooltip
					className="scholarly-bibliography-action-button"
					onClick={(event) => {
						event.stopPropagation();
						handleCopyCitation(citation);
					}}
				>
					<CopyIcon className="scholarly-bibliography-action-icon" />
				</Button>
				<Button
					label={`Edit citation: ${getEntryLabel(citation)}`}
					showTooltip
					className="scholarly-bibliography-action-button"
					onClick={(event) => {
						event.stopPropagation();
						handleEditStart(citation.id);
					}}
				>
					<EditIcon className="scholarly-bibliography-action-icon" />
				</Button>
				{isStructuredEditable && citation.displayOverride && (
					<Button
						label="Reset edits"
						showTooltip
						className="scholarly-bibliography-action-button"
						onClick={(event) => {
							event.stopPropagation();
							handleResetAutoFormat(citation.id);
						}}
					>
						<ResetIcon className="scholarly-bibliography-action-icon" />
					</Button>
				)}
				<Button
					label={`Delete citation: ${getEntryLabel(citation)}`}
					showTooltip
					className="scholarly-bibliography-action-button scholarly-bibliography-action-button-delete"
					onClick={(event) => {
						event.stopPropagation();
						handleDelete(citation.id);
					}}
				>
					<DeleteIcon className="scholarly-bibliography-action-icon" />
				</Button>
			</span>
		</>
	);
}
