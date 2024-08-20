// utils/dataUtils.js

import { faker } from '@faker-js/faker';


export const recruitmentFields = {
    'Report Information': [
      'Report Title',
      'Report Date',
      'Reporting Period',
      'Prepared By',
      'Reviewed By',
      'Department/Team',
    ],
    'Candidate Information': [
      'Candidate Name',
      'Candidate ID',
      'Job Title Applied For',
      'Department Applied To',
      'Application Date',
      'Source of Application',
      'Resume/CV',
      'Current Status',
    ],
    'Recruitment Process Details': [
      'Screening Date',
      'Screening Outcome',
      'Interview Dates',
      'Interviewers',
      'Interview Scores/Feedback',
      'Assessment Results',
      'Background Check Status',
      'Offer Date',
      'Offer Acceptance Date',
      'Onboarding Date',
      'Onboarding Status',
    ],
    'Job Requisition Details': [
      'Job Requisition ID',
      'Position Title',
      'Department',
      'Hiring Manager',
      'Date Requisition Created',
      'Requisition Status',
      'Number of Positions',
      'Number of Candidates Screened',
      'Number of Candidates Interviewed',
      'Number of Offers Made',
      'Number of Offers Accepted',
      'Time to Fill',
      'Time to Hire',
    ],
    'Employee Information': [
      'Employee Name',
      'Employee ID',
      'Date of Joining',
      'Current Position',
      'Current Department',
      'Probation Status',
      'Training Completion Status',
      'Performance Evaluation Scores',
      'Retention Rate',
    ],
    'Recruitment Metrics and Analytics': [
      'Total Applications Received',
      'Conversion Rate',
      'Cost per Hire',
      'Source Effectiveness',
      'Diversity Metrics',
      'Attrition Rate',
      'Recruiter Efficiency',
      'Offer Decline Reasons',
    ],
    'Employee Status Information': [
      'Current Employment Status',
      'Last Performance Review Date',
      'Next Scheduled Review Date',
      'Promotion/Transfer History',
      'Training Completed',
      'Pending Certifications',
      'Vacation/Sick Leave Status',
    ],
    'Notes and Comments': [
      'Recruiter Comments',
      'Manager Comments',
      'Additional Notes',
    ],
    'Attachments': [
      'Supporting Documents',
    ],
    'Approval and Sign-off': [
      'Manager Approval',
      'HR Sign-off',
      'Date of Approval',
    ],
  };

export const generateRandomData = (count) => {
  const jobTitles = ['Software Developer', 'UX Designer', 'Product Manager', 'Data Analyst', 'DevOps Engineer'];
  const departments = ['Engineering', 'Design', 'Product', 'Data Science', 'Operations'];
  const applicationSources = ['LinkedIn', 'Company Website', 'Job Board', 'Referral', 'Recruiter'];
  const statuses = ['New', 'In Progress', 'Interview Scheduled', 'Offer Extended', 'Hired', 'Rejected'];
  const requisitionStatuses = ['Open', 'Closed', 'On Hold'];
  const employmentStatuses = ['Active', 'On Probation', 'Terminated', 'Resigned'];

  return Array.from({ length: count }, (_, index) => {
    const applicationDate = faker.date.past();
    const screeningDate = faker.date.between(applicationDate, new Date());
    const interviewDate = faker.date.between(screeningDate, new Date());
    const offerDate = faker.date.between(interviewDate, new Date());
    const offerAcceptanceDate = faker.date.between(offerDate, new Date());
    const onboardingDate = faker.date.future(0.1, offerAcceptanceDate);
    const joinDate = faker.date.future(0.1, onboardingDate);

    const jobTitle = faker.helpers.arrayElement(jobTitles);
    const department = faker.helpers.arrayElement(departments);
    const currentStatus = faker.helpers.arrayElement(statuses);

    return {
      // Report Information
      reportTitle: `Recruitment Report ${faker.number.int(1000)}`,
      reportDate: faker.date.recent(),
      reportingPeriod: faker.helpers.arrayElement(['Weekly', 'Monthly', 'Quarterly']),
      preparedBy: faker.person.fullName(),
      reviewedBy: faker.person.fullName(),
      departmentTeam: department,

      // Candidate Information
      candidateName: faker.person.fullName(),
      candidateId: faker.string.uuid(),
      jobTitleAppliedFor: jobTitle,
      departmentAppliedTo: department,
      applicationDate,
      sourceOfApplication: faker.helpers.arrayElement(applicationSources),
      resumeCV: faker.internet.url(),
      currentStatus,

      // Recruitment Process Details
      screeningDate,
      screeningOutcome: faker.helpers.arrayElement(['Pass', 'Fail']),
      interviewDates: {
        initial: interviewDate,
        technical: faker.date.between(interviewDate, new Date()),
        hr: faker.date.between(interviewDate, new Date()),
      },
      interviewers: [
        { name: faker.person.fullName(), role: 'Hiring Manager' },
        { name: faker.person.fullName(), role: 'Team Lead' },
        { name: faker.person.fullName(), role: 'HR Representative' },
      ],
      interviewScoresFeedback: faker.number.float({ min: 1, max: 10, precision: 0.1 }),
      assessmentResults: faker.helpers.arrayElement(['Excellent', 'Good', 'Average', 'Poor']),
      backgroundCheckStatus: faker.helpers.arrayElement(['Pending', 'Completed', 'Failed']),
      offerDate,
      offerAcceptanceDate,
      onboardingDate,
      onboardingStatus: faker.helpers.arrayElement(['Not Started', 'In Progress', 'Completed']),

      // Job Requisition Details
      jobRequisitionId: faker.string.alphanumeric(8).toUpperCase(),
      positionTitle: jobTitle,
      hiringManager: faker.person.fullName(),
      dateRequisitionCreated: faker.date.past(),
      requisitionStatus: faker.helpers.arrayElement(requisitionStatuses),
      numberOfPositions: faker.number.int({ min: 1, max: 5 }),
      numberOfCandidatesScreened: faker.number.int({ min: 10, max: 100 }),
      numberOfCandidatesInterviewed: faker.number.int({ min: 5, max: 20 }),
      numberOfOffersMade: faker.number.int({ min: 1, max: 5 }),
      numberOfOffersAccepted: faker.number.int({ min: 0, max: 5 }),
      timeToFill: faker.number.int({ min: 30, max: 90 }),
      timeToHire: faker.number.int({ min: 45, max: 120 }),

      // Employee Information
      employeeName: faker.person.fullName(),
      employeeId: faker.string.alphanumeric(6).toUpperCase(),
      dateOfJoining: joinDate,
      currentPosition: jobTitle,
      currentDepartment: department,
      probationStatus: faker.helpers.arrayElement(['On Probation', 'Completed', 'Extended']),
      trainingCompletionStatus: faker.helpers.arrayElement(['Not Started', 'In Progress', 'Completed']),
      performanceEvaluationScores: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
      retentionRate: faker.number.float({ min: 0.5, max: 1, precision: 0.01 }),

      // Recruitment Metrics and Analytics
      totalApplicationsReceived: faker.number.int({ min: 50, max: 500 }),
      conversionRate: faker.number.float({ min: 0.01, max: 0.1, precision: 0.001 }),
      costPerHire: faker.number.float({ min: 1000, max: 10000, precision: 0.01 }),
      sourceEffectiveness: {
        LinkedIn: faker.number.float({ min: 0.1, max: 0.5, precision: 0.01 }),
        'Company Website': faker.number.float({ min: 0.1, max: 0.5, precision: 0.01 }),
        'Job Board': faker.number.float({ min: 0.1, max: 0.5, precision: 0.01 }),
        Referral: faker.number.float({ min: 0.1, max: 0.5, precision: 0.01 }),
        Recruiter: faker.number.float({ min: 0.1, max: 0.5, precision: 0.01 }),
      },
      diversityMetrics: {
        gender: {
          male: faker.number.float({ min: 0.3, max: 0.7, precision: 0.01 }),
          female: faker.number.float({ min: 0.3, max: 0.7, precision: 0.01 }),
          other: faker.number.float({ min: 0, max: 0.1, precision: 0.01 }),
        },
        ethnicity: {
          white: faker.number.float({ min: 0.2, max: 0.6, precision: 0.01 }),
          asian: faker.number.float({ min: 0.1, max: 0.4, precision: 0.01 }),
          hispanic: faker.number.float({ min: 0.1, max: 0.3, precision: 0.01 }),
          black: faker.number.float({ min: 0.1, max: 0.3, precision: 0.01 }),
          other: faker.number.float({ min: 0, max: 0.1, precision: 0.01 }),
        },
      },
      attritionRate: faker.number.float({ min: 0.05, max: 0.2, precision: 0.01 }),
      recruiterEfficiency: faker.number.float({ min: 1, max: 10, precision: 0.1 }),
      offerDeclineReasons: faker.helpers.arrayElement(['Better Offer', 'Salary', 'Location', 'Role Mismatch', 'Personal Reasons']),

      // Employee Status Information
      currentEmploymentStatus: faker.helpers.arrayElement(employmentStatuses),
      lastPerformanceReviewDate: faker.date.past(),
      nextScheduledReviewDate: faker.date.future(),
      promotionTransferHistory: [
        { date: faker.date.past(), type: faker.helpers.arrayElement(['Promotion', 'Transfer']), details: faker.lorem.sentence() },
      ],
      trainingCompleted: [
        { name: 'Onboarding', date: faker.date.past() },
        { name: faker.helpers.arrayElement(['Leadership', 'Technical Skills', 'Soft Skills']), date: faker.date.past() },
      ],
      pendingCertifications: faker.helpers.arrayElement(['Project Management', 'Agile Scrum', 'Cloud Computing', 'None']),
      vacationSickLeaveStatus: {
        vacationDaysUsed: faker.number.int({ min: 0, max: 20 }),
        vacationDaysRemaining: faker.number.int({ min: 0, max: 20 }),
        sickDaysUsed: faker.number.int({ min: 0, max: 10 }),
        sickDaysRemaining: faker.number.int({ min: 0, max: 10 }),
      },

      // Notes and Comments
      recruiterComments: faker.lorem.paragraph(),
      managerComments: faker.lorem.paragraph(),
      additionalNotes: faker.lorem.sentences(2),

      // Attachments
      supportingDocuments: [
        { name: 'Offer Letter', url: faker.internet.url() },
        { name: 'Interview Transcript', url: faker.internet.url() },
      ],

      // Approval and Sign-off
      managerApproval: faker.helpers.arrayElement(['Pending', 'Approved', 'Rejected']),
      hrSignOff: faker.helpers.arrayElement(['Pending', 'Completed']),
      dateOfApproval: faker.date.recent(),
    };
  });
};







// export const generateRandomData = (count) => {
//     const jobTitles = ['Developer', 'Designer', 'Manager', 'Analyst', 'Tester'];
//     const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'UI/UX', 'Agile', 'SQL', 'Java', 'C#'];
  
//     return Array.from({ length: count }, (_, index) => ({
//       id: index + 1,
//       name: `Employee ${index + 1}`,
//       email: `employee${index + 1}@example.com`,
//       jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
//       experience: Math.floor(Math.random() * 20) + 1,
//       skills: Array.from(
//         { length: Math.floor(Math.random() * 3) + 1 },
//         () => skills[Math.floor(Math.random() * skills.length)]
//       ).join(', ')
//     }));
// };
