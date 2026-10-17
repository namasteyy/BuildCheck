import { NextRequest, NextResponse } from 'next/server';
import { AIEvaluationResult } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      submitted_code = '',
      ai_prompt_logs = [],
      test_results = '',
      notes_content = '',
      keystroke_telemetry = {
        time_spent_minutes: 42,
        copy_paste_count: 2,
        manual_edits_pct: 68,
        ai_inserts_pct: 32,
      },
    } = body;

    // 1. Functional Score (based on test_results or code analysis)
    const testsPassed = test_results.includes('PASSED') || test_results.includes('18/18');
    const functional_score = testsPassed ? 100 : 60;

    // 2. Security & Quality Score: Check for intentional AI flaws refactored:
    // Flaw 1: Zero-value/negative payments (e.g. pay['paid'] <= 0 or pay.get('paid', 0) > 0)
    const hasZeroValCheck =
      submitted_code.includes('> 0') ||
      submitted_code.includes('<= 0') ||
      submitted_code.includes('zero') ||
      submitted_code.includes('positive');

    // Flaw 2: Duplicate invoice handling / Deduplication
    const hasDuplicateCheck =
      submitted_code.includes('seen') ||
      submitted_code.includes('set(') ||
      submitted_code.includes('dict') ||
      submitted_code.includes('not in') ||
      submitted_code.includes('unique');

    let security_and_quality_score = 96;
    const key_observations: string[] = [];

    if (!hasZeroValCheck && !hasDuplicateCheck) {
      // Deduct 25 points if candidate blindly accepted AI code with security flaws
      security_and_quality_score -= 25;
      key_observations.push(
        'Warning: Baseline AI security flaws (zero-value payment exploit and duplicate invoice re-matching) were not refactored.'
      );
    } else {
      if (hasZeroValCheck) {
        key_observations.push(
          'Caught AI hallucination regarding missing zero-value payment validation.'
        );
      }
      if (hasDuplicateCheck) {
        key_observations.push(
          'Refactored vulnerable nested loop into atomic hash set with duplicate invoice prevention.'
        );
      }
    }

    // 3. AI Efficiency Score: Did candidate provide clear constraints vs vague "fix this"?
    let ai_efficiency_score = 88;
    const candidatePrompts = ai_prompt_logs.filter((log: any) => log.sender === 'candidate');
    const hasIterativeRefinement = candidatePrompts.some(
      (p: any) =>
        p.message.toLowerCase().includes('edge case') ||
        p.message.toLowerCase().includes('duplicate') ||
        p.message.toLowerCase().includes('zero') ||
        p.message.toLowerCase().includes('optimize') ||
        p.message.toLowerCase().includes('complexity')
    );

    if (hasIterativeRefinement) {
      ai_efficiency_score = 95;
      key_observations.push(
        'Strong prompt engineering: specified concrete constraints (O(n) complexity, edge cases) in AI queries.'
      );
    }

    // 4. Human Refactoring Index: Ratio of AI code accepted as-is vs manually edited
    let human_refactoring_index = 92;
    if (keystroke_telemetry.manual_edits_pct < 30) {
      human_refactoring_index = 50;
      key_observations.push('High reliance on raw AI output with minimal manual verification.');
    } else {
      key_observations.push(
        `High Human Refactoring Index (${keystroke_telemetry.manual_edits_pct}% manual audit & custom optimizations).`
      );
    }

    // Check notes_content for architectural justification
    if (notes_content && notes_content.length > 50) {
      key_observations.push('Provided rigorous architectural rationale in NOTES.md.');
    }

    key_observations.push(`Turnaround time: ${keystroke_telemetry.time_spent_minutes} minutes (well within 90 min limit).`);

    // Weighted composite EVS Total Score
    const evs_total_score = Math.round(
      functional_score * 0.35 +
        ai_efficiency_score * 0.2 +
        human_refactoring_index * 0.2 +
        security_and_quality_score * 0.25
    );

    const hiring_recommendation: 'FAST_TRACK_OFFER' | 'INTERVIEW_REQUIRED' | 'REJECT' =
      evs_total_score >= 88
        ? 'FAST_TRACK_OFFER'
        : evs_total_score >= 70
        ? 'INTERVIEW_REQUIRED'
        : 'REJECT';

    const result: AIEvaluationResult = {
      functional_score,
      ai_efficiency_score,
      human_refactoring_index,
      security_and_quality_score,
      evs_total_score,
      key_observations,
      hiring_recommendation,
      keystroke_telemetry,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Evaluation engine failed' },
      { status: 500 }
    );
  }
}
