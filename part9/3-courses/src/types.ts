export interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

export interface CoursePartBaseWithDesc extends CoursePartBase {
  description: string;
}

export interface CoursePartBasic extends CoursePartBaseWithDesc {
  kind: "basic"
}

export interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

export interface CoursePartBackground extends CoursePartBaseWithDesc {
  backgroundMaterial: string;
  kind: "background"
}

export interface CoursePartRequirements extends CoursePartBaseWithDesc {
  requirements: string[];
  kind: "special"
}

export type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartRequirements;