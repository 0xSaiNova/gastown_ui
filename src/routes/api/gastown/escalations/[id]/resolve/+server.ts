import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

// GT_ROOT for accessing beads from the orchestrator level
const GT_ROOT = '/Users/amrit/Documents/Projects/Rust/mouchak/gastown_exp';

export interface ResolveRequest {
	selectedOption?: number;
	resolutionNote?: string;
}

export interface ResolveResponse {
	success: boolean;
	error?: string;
}

/** POST: Resolve an escalation by closing the bead */
export const POST: RequestHandler = async ({ params, request }) => {
	const { id } = params;

	if (!id) {
		return json({ success: false, error: 'Escalation ID required' }, { status: 400 });
	}

	try {
		const body: ResolveRequest = await request.json();
		const { selectedOption, resolutionNote } = body;

		// Build bd close command
		let cmd = `bd close ${id}`;

		// Add resolution note if provided
		if (resolutionNote && resolutionNote.trim()) {
			// Escape quotes in the note
			const escapedNote = resolutionNote.replace(/"/g, '\\"');
			cmd += ` --comment "${escapedNote}"`;
		}

		// If a decision option was selected, add it to the comment
		if (selectedOption !== undefined && selectedOption !== null) {
			const optionNote = `Selected option: ${selectedOption}`;
			if (resolutionNote && resolutionNote.trim()) {
				const escapedCombined = `${optionNote}\n${resolutionNote}`.replace(/"/g, '\\"');
				cmd = `bd close ${id} --comment "${escapedCombined}"`;
			} else {
				cmd = `bd close ${id} --comment "${optionNote}"`;
			}
		}

		const { stdout, stderr } = await execAsync(cmd, {
			cwd: GT_ROOT
		});

		return json({ success: true });
	} catch (error) {
		console.error(`Failed to resolve escalation ${id}:`, error);

		const errorMessage = error instanceof Error ? error.message : 'Failed to resolve escalation';

		// Check for specific errors
		if (errorMessage.includes('not found')) {
			return json({ success: false, error: `Escalation "${id}" not found` }, { status: 404 });
		}

		if (errorMessage.includes('already closed')) {
			return json({ success: false, error: 'Escalation is already resolved' }, { status: 400 });
		}

		return json({ success: false, error: errorMessage }, { status: 500 });
	}
};
