import { MAHARASHTRA_STATUTORY_CORPUS } from './statutory-corpus';
import { statutoryRAG } from './hybrid-rag-engine';

export interface SimplifiedQueryResult {
  rawNoticeText: string;
  identifiedDepartment: string;
  citedActOrRule: string;
  severity: 'CRITICAL_BLOCKER' | 'STANDARD_QUERY' | 'MINOR_CLARIFICATION';
  estimatedTimelineDelayDays: number;
  plainEnglishExplanation: string;
  whyThisHappened: string;
  actionableSteps: string[];
  suggestedOfficialResponseLetter: string;
  relevantStatutoryCitation: {
    actTitle: string;
    sectionOrRule: string;
    statutorySafeguard?: string;
  };
}

/**
 * NLP Rules and Pattern Matching for Departmental Queries across Maharashtra Authorities
 */
export class MaharashtraNLPSimplifier {
  /**
   * Translates a complex departmental query or notice into simple, human-understandable English
   */
  public simplifyDepartmentQuery(rawNoticeText: string): SimplifiedQueryResult {
    const text = (rawNoticeText || '').toLowerCase();

    // 1. Check for Water / MPCB / ETP queries
    if (text.includes('water') || text.includes('etp') || text.includes('zld') || text.includes('effluent') || text.includes('cte') || text.includes('discharge')) {
      const chunk = MAHARASHTRA_STATUTORY_CORPUS.find(c => c.id === 'WATER_ACT_SEC_25_CTE')!;
      return {
        rawNoticeText,
        identifiedDepartment: 'Maharashtra Pollution Control Board (MPCB)',
        citedActOrRule: 'Water Act 1974, Section 25',
        severity: 'CRITICAL_BLOCKER',
        estimatedTimelineDelayDays: 16,
        plainEnglishExplanation: 'The MPCB pollution officer wants to know exactly where every drop of factory wastewater will go and how your treatment plant cleans it before you start construction.',
        whyThisHappened: 'MPCB requires a detailed water-balance flowchart showing that wastewater is recycled (Zero Liquid Discharge) rather than discharged outside.',
        actionableSteps: [
          'Download the pre-audited ETP Chemical Mass Balance template from MahaVault.',
          'Attach your wastewater recycling schematic signed by a certified chartered engineer.',
          'Submit the response using the pre-drafted letter below within 15 days.',
        ],
        suggestedOfficialResponseLetter: `To,\nThe Sub-Regional Officer,\nMaharashtra Pollution Control Board (MPCB),\n\nSubject: Clarification on Water Mass Balance and ETP Design for Consent to Establish (CTE)\nRef: Notice / Query dated ${new Date().toLocaleDateString()}\n\nRespected Sir,\n\nWith reference to your query regarding the industrial effluent recycling flowchart under Section 25 of the Water Act 1974, we hereby submit the comprehensive Mass Balance Schematic and Effluent Treatment Plant (ETP) layout pre-verified through MahaVault.\n\nOur system incorporates 100% Zero Liquid Discharge (ZLD) utilizing Multi-Effect Evaporation (MEE). We request your kind office to grant the Consent to Establish (CTE) under the Maharashtra RTS Act statutory timeframe.\n\nYours faithfully,\nAuthorized Signatory`,
        relevantStatutoryCitation: {
          actTitle: chunk.actTitle,
          sectionOrRule: chunk.sectionOrRule,
          statutorySafeguard: chunk.statutorySafeguard,
        },
      };
    }

    // 2. Check for MIDC Driveway / Setback queries
    if (text.includes('setback') || text.includes('driveway') || text.includes('rule 14') || text.includes('margin') || text.includes('turning') || text.includes('dcr') || text.includes('radius')) {
      const chunk = MAHARASHTRA_STATUTORY_CORPUS.find(c => c.id === 'MIDC_DCR_RULE_14_SETBACKS')!;
      return {
        rawNoticeText,
        identifiedDepartment: 'MIDC Special Planning Authority (SPA)',
        citedActOrRule: 'MIDC DCR 2009, Rule 14.1 (Setbacks & Fire Margins)',
        severity: 'STANDARD_QUERY',
        estimatedTimelineDelayDays: 10,
        plainEnglishExplanation: 'The building plan scrutiny officer found that your architectural drawings do not leave a wide enough clear road (12 meters) around the building for fire trucks to circle and turn.',
        whyThisHappened: 'MIDC building regulations require an unobstructed corridor so that in a fire emergency, fire engines can reach all 4 sides of the factory.',
        actionableSteps: [
          'Ask your architect to adjust the side/rear margin to a minimum 12.0m clear width.',
          'Ensure the 4 corner turning radiuses are marked at 15.0m.',
          'Upload revised CAD file to MahaVault to verify setbacks before submitting to MIDC BPAMS.',
        ],
        suggestedOfficialResponseLetter: `To,\nThe Executive Engineer,\nMIDC Special Planning Authority (SPA),\n\nSubject: Submission of Revised Architectural Layout Complying with Rule 14.1 Setbacks\n\nRespected Sir,\n\nIn response to the automated scrutiny objection regarding peripheral driveway clearances under Rule 14.1 of MIDC DCR 2009, we have adjusted our site plan to provide a 12.0m unobstructed reinforced peripheral corridor with a 15.0m turning radius at all junctions.\n\nPlease find the revised CAD drawing attached for your expedited Building Plan Approval.\n\nYours faithfully,\nAuthorized Architect & Promoter`,
        relevantStatutoryCitation: {
          actTitle: chunk.actTitle,
          sectionOrRule: chunk.sectionOrRule,
          statutorySafeguard: chunk.statutorySafeguard,
        },
      };
    }

    // 3. Check for DISH / Fire Joint Inspection queries
    if (text.includes('dish') || text.includes('factory license') || text.includes('fire') || text.includes('inspection') || text.includes('inspector') || text.includes('reschedule')) {
      const chunk = MAHARASHTRA_STATUTORY_CORPUS.find(c => c.id === 'FACTORIES_ACT_DISH_LICENSE')!;
      return {
        rawNoticeText,
        identifiedDepartment: 'Directorate of Industrial Safety & Health (DISH) & Fire Services',
        citedActOrRule: 'Maharashtra Factories Rules 1963, Rule 4 & RTS Act 2015',
        severity: 'STANDARD_QUERY',
        estimatedTimelineDelayDays: 14,
        plainEnglishExplanation: 'The factory inspector (DISH) and the fire officer have not synchronized their site visit dates, which could stall your final license.',
        whyThisHappened: 'Historically, DISH and Fire inspected on separate dates months apart, causing unnecessary operational downtime.',
        actionableSteps: [
          'Use the AnumatiOne Single-Window Joint Inspection Protocol.',
          'Book a unified 48-hour inspection slot that auto-notifies both DISH and Fire officers.',
          'Have your machinery layout and emergency exits pre-audited on site.',
        ],
        suggestedOfficialResponseLetter: `To,\nThe Joint Director, DISH Maharashtra & Chief Fire Officer, MIDC,\n\nSubject: Request for Synchronized Joint Site Inspection under Maharashtra RTS Act Protocol\n\nRespected Officers,\n\nTo facilitate the statutory inspection of our industrial premises in accordance with Rule 4 of Maharashtra Factories Rules 1963, we request a synchronized Joint Inspection on our requested 48-hour window.\n\nAll safety installations, emergency exits, and firefighting reservoirs are installed and ready for physical verification.\n\nYours faithfully,\nOccupier / Factory Manager`,
        relevantStatutoryCitation: {
          actTitle: chunk.actTitle,
          sectionOrRule: chunk.sectionOrRule,
          statutorySafeguard: chunk.statutorySafeguard,
        },
      };
    }

    // Default Fallback: Leverage RAG for any arbitrary query
    const ragResult = statutoryRAG.search(rawNoticeText, 1)[0];
    const chunk = ragResult ? ragResult.chunk : MAHARASHTRA_STATUTORY_CORPUS[0];

    return {
      rawNoticeText,
      identifiedDepartment: chunk.department,
      citedActOrRule: `${chunk.actTitle}, ${chunk.sectionOrRule}`,
      severity: 'STANDARD_QUERY',
      estimatedTimelineDelayDays: 7,
      plainEnglishExplanation: chunk.plainEnglishExplanation,
      whyThisHappened: 'The departmental officer requires statutory clarification to ensure compliance before issuing final approval.',
      actionableSteps: chunk.actionableSteps,
      suggestedOfficialResponseLetter: `To,\nThe Designated Officer,\n${chunk.department},\n\nSubject: Clarification on Statutory Requirements under ${chunk.actTitle}\n\nRespected Sir,\n\nWith reference to the official communication regarding our industrial project, please find enclosed the requisite supporting documentation pre-verified in accordance with state guidelines.\n\nWe request your kind office to process our approval under the statutory SLA mandate of the Maharashtra RTS Act 2015.\n\nYours faithfully,\nAuthorized Signatory`,
      relevantStatutoryCitation: {
        actTitle: chunk.actTitle,
        sectionOrRule: chunk.sectionOrRule,
        statutorySafeguard: chunk.statutorySafeguard,
      },
    };
  }
}

export const nlpSimplifier = new MaharashtraNLPSimplifier();
