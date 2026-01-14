import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

interface RigSnapshot {
	name: string;
	status: 'active' | 'idle';
	polecats: number;
	has_witness: boolean;
	has_refinery: boolean;
	active_work: number;
}

interface PolecatSnapshot {
	id: string;
	name: string;
	role: string;
	rig: string;
	status: 'running' | 'idle';
	has_work: boolean;
	task?: string;
}

interface ConvoySnapshot {
	id: string;
	title: string;
	status: string;
	priority: number;
	issue_count?: number;
}

interface ActivitySnapshot {
	id: string;
	title: string;
	type: string;
	status: string;
	updated_at: string;
}

export interface GasТownSnapshot {
	rigs: RigSnapshot[];
	polecats: PolecatSnapshot[];
	convoys: ConvoySnapshot[];
	recent_activity: ActivitySnapshot[];
	timestamp: string;
}

/**
 * GET: Return a coherent snapshot of Gas Town state
 *
 * Aggregates data from:
 * - gt status (rigs, polecats)
 * - bd list (convoys, recent activity)
 */
export const GET: RequestHandler = async () => {
	try {
		// Fetch gt status for rigs and polecats
		const statusPromise = execAsync('gt status --json', { timeout: 5000 }).catch(() => ({
			stdout: '{"agents":[],"rigs":[]}'
		}));

		// Fetch active convoys
		const convoysPromise = execAsync('bd list --type=convoy --status=open --json', {
			timeout: 5000
		}).catch(() => ({ stdout: '[]' }));

		// Fetch recent activity (last 10 updated issues)
		const activityPromise = execAsync(
			'bd list --status=in_progress,completed --json | head -100',
			{ timeout: 5000 }
		).catch(() => ({ stdout: '[]' }));

		const [statusResult, convoysResult, activityResult] = await Promise.all([
			statusPromise,
			convoysPromise,
			activityPromise
		]);

		const gtStatus = JSON.parse(statusResult.stdout || '{"agents":[],"rigs":[]}');
		const convoysData = JSON.parse(convoysResult.stdout || '[]');
		const activityData = JSON.parse(activityResult.stdout || '[]');

		// Transform rigs
		const rigs: RigSnapshot[] = (gtStatus.rigs || []).map((rig: any) => {
			const activePolecats = (rig.agents || []).filter(
				(a: any) => a.role === 'polecat' && a.running && a.has_work
			).length;

			return {
				name: rig.name,
				status: activePolecats > 0 ? 'active' : 'idle',
				polecats: (rig.polecats || []).length,
				has_witness: rig.has_witness || false,
				has_refinery: rig.has_refinery || false,
				active_work: activePolecats
			};
		});

		// Transform polecats
		const polecats: PolecatSnapshot[] = [];
		for (const rig of gtStatus.rigs || []) {
			for (const agent of rig.agents || []) {
				if (agent.role === 'polecat') {
					const hookData = (rig.hooks || []).find((h: any) => h.agent === agent.address);
					polecats.push({
						id: agent.address.replace(/\//g, '-').replace(/-$/, '') || agent.name,
						name: agent.name.charAt(0).toUpperCase() + agent.name.slice(1),
						role: agent.role,
						rig: rig.name,
						status: agent.running ? 'running' : 'idle',
						has_work: agent.has_work || false,
						task: hookData?.bead_id || agent.first_subject || undefined
					});
				}
			}
		}

		// Transform convoys
		const convoys: ConvoySnapshot[] = (convoysData || [])
			.slice(0, 10)
			.map((c: any) => ({
				id: c.id,
				title: c.title,
				status: c.status,
				priority: c.priority || 2,
				issue_count: c.issue_count
			}));

		// Transform recent activity
		const recent_activity: ActivitySnapshot[] = (activityData || [])
			.slice(0, 10)
			.map((item: any) => ({
				id: item.id,
				title: item.title,
				type: item.issue_type || item.type,
				status: item.status,
				updated_at: item.updated_at
			}));

		const snapshot: GasТownSnapshot = {
			rigs,
			polecats,
			convoys,
			recent_activity,
			timestamp: new Date().toISOString()
		};

		return json(snapshot);
	} catch (error) {
		console.error('Failed to generate snapshot:', error);
		return json(
			{
				error: error instanceof Error ? error.message : 'Failed to generate snapshot',
				timestamp: new Date().toISOString()
			},
			{ status: 500 }
		);
	}
};
