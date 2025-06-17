import { CanvasEntity } from "./index.js";

export interface GradingSchemeEntry {
  // The name for an entry value within a GradingStandard that describes the range
  // of the value
  name: string;
  // The value for the name of the entry within a GradingStandard. The entry
  // represents the lower bound of the range for the entry. This range includes
  // the value up to the next entry in the GradingStandard, or the maximum value
  // for the scheme if there is no upper bound. The lowest value will have a lower
  // bound range of 0.
  value: number;
  // The value that will be used to compare against a grade. For percentage based
  // grading schemes, this is a number from 0 - 100 representing a percent. For
  // point based grading schemes, this is the lower bound of points to achieve the
  // grade.
  calculated_value?: number;
}

export interface GradingStandard extends CanvasEntity {
  // the title of the grading standard
  title: string;
  // the context this standard is associated with, either 'Account' or 'Course'
  context_type: "Account" | "Course";
  // the id for the context either the Account or Course id
  context_id: number;
  // whether this is a points-based standard
  points_based: boolean;
  // the factor by which to scale a score. 1 for percentage based schemes and the
  // max value of points for points based schemes. This number cannot be changed
  // for percentage based schemes.
  scaling_factor: number;
  // A list of GradingSchemeEntry that make up the Grading Standard as an array of
  // values with the scheme name and value
  grading_scheme: GradingSchemeEntry[];
}

export interface GradingStandardCreateParams {
  // The title for the Grading Standard.
  title: string;
  // Whether or not a grading scheme is points based. Defaults to false.
  points_based?: boolean;
  // The factor by which to scale a percentage into a points based scheme grade.
  // This is the maximum number of points possible in the grading scheme.
  // Defaults to 1. Not required for percentage based grading schemes.
  scaling_factor?: number;
  // Array of grading scheme entries
  grading_scheme_entry: Array<{
    // The name for an entry value within a GradingStandard that describes the range of the value e.g. A-
    name: string;
    // The value for the name of the entry within a GradingStandard. The entry represents the lower bound of the range for the entry. This range includes the value up to the next entry in the GradingStandard, or 100 if there is no upper bound. The lowest value will have a lower bound range of 0. e.g. 93
    value: number;
  }>;
}

export interface GradingStandardListParams {
  // Context type (course or account)
  context_type: "course" | "account";
  // Context ID
  context_id: string;
}

export interface GradingStandardGetParams {
  // Context type (course or account)
  context_type: "course" | "account";
  // Context ID
  context_id: string;
  // Grading standard ID
  grading_standard_id: string;
}
