// Centralized event definitions for easier curation.
// Keep pure data here (no imports) to avoid circular dependencies.

export const EVENTS = {
  'supplier-discount': {
    id: 'supplier-discount',
    title: 'Supplier Discount',
    description: 'Your dental supply company offers a bulk discount on materials. This could save you money on daily operations.',
    type: 'opportunity' as const,
    emoji: '🏷️',
    choices: [
      {
        id: 'bulk-buy',
        text: 'Buy 3 months of supplies for $400',
        cost: 400,
        outcomes: [
          {
            probability: 40,
            description: 'Great decision! You save money on supplies and operations run smoothly.',
            cashChange: 200,
            reputationChange: 1
          },
          {
            probability: 60,
            description: 'Supplies sit unused longer than expected. You break even.',
            cashChange: 0,
            reputationChange: 0
          }
        ]
      },
      {
        id: 'skip',
        text: 'Skip the offer',
        cost: 0,
        outcomes: [
          {
            probability: 100,
            description: 'You continue with regular supply purchases.',
            cashChange: 0
          }
        ]
      }
    ]
  },
  'marketing-opportunity': {
    id: 'marketing-opportunity',
    title: 'Local News Feature',
    description: 'A health reporter wants to feature your clinic in a dental health article. This could bring many new patients!',
    type: 'opportunity' as const,
    emoji: '📰',
    choices: [
      {
        id: 'invest',
        text: 'Invest $600 in professional photos and marketing materials',
        cost: 600,
        outcomes: [
          {
            probability: 50,
            description: 'The article is a huge success! New patients flood in and your reputation soars.',
            cashChange: 1200,
            reputationChange: 15
          },
          {
            probability: 30,
            description: 'The article gets moderate attention. You gain some new patients.',
            cashChange: 300,
            reputationChange: 5
          },
          {
            probability: 20,
            description: 'The article gets little attention. You lose your marketing investment.',
            cashChange: 0,
            reputationChange: -1
          }
        ]
      },
      {
        id: 'decline',
        text: 'Decline - focus on current patients',
        cost: 0,
        outcomes: [
          {
            probability: 100,
            description: 'You miss the opportunity but maintain your current patient base.',
            cashChange: 0,
            reputationChange: 0
          }
        ]
      }
    ]
  },
  'equipment-breakdown': {
    id: 'equipment-breakdown',
    title: 'Dental Chair Malfunction',
    description: 'Your main dental chair has stopped working! You need to fix it immediately or lose patients.',
    type: 'risk' as const,
    emoji: '🔧',
    choices: [
      {
        id: 'repair',
        text: 'Pay $300 for immediate repair',
        cost: 300,
        outcomes: [
          {
            probability: 80,
            description: 'Equipment is fixed quickly. Your patients are impressed by your quick response.',
            cashChange: 0,
            reputationChange: 2
          },
          {
            probability: 20,
            description: 'Equipment is fixed but some patients were already frustrated and left bad reviews.',
            cashChange: 0,
            reputationChange: -1
          }
        ]
      },
      {
        id: 'wait',
        text: 'Wait for cheaper repair (lose patients)',
        cost: 0,
        outcomes: [
          {
            probability: 40,
            description: 'Only a few patients are frustrated. You lose some revenue but reputation stays stable.',
            cashChange: -150,
            reputationChange: -2
          },
          {
            probability: 60,
            description: 'Many patients are frustrated and leave bad reviews. Your reputation takes a hit.',
            cashChange: -300,
            reputationChange: -6
          }
        ]
      }
    ]
  },
  'viral-bad-review': {
    id: 'viral-bad-review',
    title: 'Viral Bad Review',
    description: 'A patient posted a scathing review that\'s starting to go viral on social media! This could seriously damage your reputation.',
    type: 'risk' as const,
    emoji: '😡',
    choices: [
      {
        id: 'pr-control',
        text: 'Pay $200 for PR damage control',
        cost: 200,
        outcomes: [
          {
            probability: 50,
            description: 'PR efforts help contain the damage. The review fades away quickly.',
            cashChange: 0,
            reputationChange: -3
          },
          {
            probability: 50,
            description: 'The review continues to spread despite PR efforts. Damage is worse than expected.',
            cashChange: 0,
            reputationChange: -8
          }
        ]
      },
      {
        id: 'ignore',
        text: 'Ignore it and hope it blows over',
        cost: 0,
        outcomes: [
          {
            probability: 20,
            description: 'The review fades away naturally. No lasting damage.',
            cashChange: 0,
            reputationChange: -2
          },
          {
            probability: 80,
            description: 'The review goes viral! Your reputation takes a massive hit.',
            cashChange: -400,
            reputationChange: -20
          }
        ]
      }
    ]
  },
  'mystery-patient': {
    id: 'mystery-patient',
    title: 'Mystery Patient',
    description: 'A well-dressed stranger arrives claiming to be a "secret shopper" for a dental magazine. They want a full evaluation.',
    type: 'opportunity' as const,
    emoji: '🕵️',
    choices: [
      {
        id: 'treat',
        text: 'Provide excellent service (normal rates)',
        cost: 0,
        outcomes: [
          {
            probability: 40,
            description: 'It was a real reviewer! Your clinic gets featured in a major dental magazine.',
            cashChange: 800,
            reputationChange: 20
          },
          {
            probability: 35,
            description: 'The person was legitimate but the review was mixed. Some positive attention.',
            cashChange: 400,
            reputationChange: 5
          },
          {
            probability: 25,
            description: 'It was a scammer trying to get free treatment. You waste time and get nothing.',
            cashChange: 0,
            reputationChange: 0
          }
        ]
      },
      {
        id: 'decline',
        text: 'Politely decline - too busy for evaluations',
        cost: 0,
        outcomes: [
          {
            probability: 100,
            description: 'You miss the opportunity but avoid potential scams.',
            cashChange: 0,
            reputationChange: 0
          }
        ]
      }
    ]
  },
  'staff-theft': {
    id: 'staff-theft',
    title: 'Suspected Theft',
    description: 'You suspect one of your staff members has been stealing supplies. You need to handle this carefully.',
    type: 'risk' as const,
    emoji: '🕵️‍♀️',
    choices: [
      {
        id: 'investigate',
        text: 'Hire a private investigator for $300',
        cost: 300,
        outcomes: [
          {
            probability: 50,
            description: 'You catch the thief red-handed! Staff morale improves and theft stops.',
            cashChange: 200,
            reputationChange: 3
          },
          {
            probability: 30,
            description: 'Investigation finds nothing. Staff feels mistrusted and morale drops.',
            cashChange: 0,
            reputationChange: -3
          },
          {
            probability: 20,
            description: 'Investigation reveals it was a misunderstanding. Staff is upset about the accusation.',
            cashChange: 0,
            reputationChange: -5
          }
        ]
      },
      {
        id: 'ignore',
        text: 'Ignore it and hope it stops',
        cost: 0,
        outcomes: [
          {
            probability: 40,
            description: 'The theft stops on its own. No further issues.',
            cashChange: 0,
            reputationChange: 0
          },
          {
            probability: 60,
            description: 'The theft continues and gets worse. You lose more money and supplies.',
            cashChange: -500,
            reputationChange: -2
          }
        ]
      }
    ]
  },
  'celebrity-endorsement': {
    id: 'celebrity-endorsement',
    title: 'Celebrity Endorsement Offer',
    description: 'A local celebrity wants to endorse your clinic on social media... for a fee of $800.',
    type: 'opportunity' as const,
    emoji: '⭐',
    choices: [
      {
        id: 'pay',
        text: 'Pay $800 for the endorsement',
        cost: 800,
        outcomes: [
          {
            probability: 35,
            description: 'The endorsement goes viral! Your clinic becomes the talk of the town.',
            cashChange: 2000,
            reputationChange: 25
          },
          {
            probability: 45,
            description: 'The endorsement gets moderate attention. You gain some new patients.',
            cashChange: 400,
            reputationChange: 8
          },
          {
            probability: 20,
            description: 'The endorsement flops completely. The celebrity\'s followers aren\'t interested in dental care.',
            cashChange: 0,
            reputationChange: -2
          }
        ]
      },
      {
        id: 'decline',
        text: 'Decline - too expensive for uncertain results',
        cost: 0,
        outcomes: [
          {
            probability: 100,
            description: 'You save money but miss potential exposure.',
            cashChange: 0,
            reputationChange: 0
          }
        ]
      }
    ]
  },
  'health-inspection': {
    id: 'health-inspection',
    title: 'Surprise Health Inspection',
    description: 'The health department is conducting a surprise inspection. Your hygiene standards will be thoroughly checked.',
    type: 'risk' as const,
    emoji: '🧽',
    choices: [
      {
        id: 'emergency-clean',
        text: 'Pay $250 for emergency deep cleaning',
        cost: 250,
        outcomes: [
          {
            probability: 80,
            description: 'Your clinic passes with flying colors! The inspector is impressed.',
            cashChange: 0,
            reputationChange: 5
          },
          {
            probability: 20,
            description: 'The inspector still finds minor issues. You pass but with some concerns noted.',
            cashChange: 0,
            reputationChange: 1
          }
        ]
      },
      {
        id: 'risk-it',
        text: 'Hope current hygiene is sufficient',
        cost: 0,
        outcomes: [
          {
            probability: 60,
            description: 'You pass the inspection! Your hygiene standards were adequate.',
            cashChange: 0,
            reputationChange: 2
          },
          {
            probability: 40,
            description: 'You fail the inspection badly. You must pay a $600 fine and your reputation suffers.',
            cashChange: -600,
            reputationChange: -8
          }
        ]
      }
    ]
  },
  'insurance-fraud': {
    id: 'insurance-fraud',
    title: 'Insurance Fraud Investigation',
    description: 'Your insurance company is investigating potential fraud in your billing. This could be serious.',
    type: 'risk' as const,
    emoji: '🔍',
    choices: [
      {
        id: 'lawyer',
        text: 'Hire a lawyer for $1000 to defend your practice',
        cost: 1000,
        outcomes: [
          {
            probability: 70,
            description: 'Your lawyer successfully defends your practice. The investigation is dropped.',
            cashChange: 0,
            reputationChange: 0
          },
          {
            probability: 30,
            description: 'Despite the lawyer, you\'re found guilty of minor violations. You pay a $500 fine.',
            cashChange: -500,
            reputationChange: -5
          }
        ]
      },
      {
        id: 'cooperate',
        text: 'Cooperate fully with the investigation',
        cost: 0,
        outcomes: [
          {
            probability: 50,
            description: 'The investigation clears your name. Your reputation is actually enhanced.',
            cashChange: 0,
            reputationChange: 3
          },
          {
            probability: 50,
            description: 'The investigation reveals billing errors. You must pay back $800 and your reputation suffers.',
            cashChange: -800,
            reputationChange: -6
          }
        ]
      }
    ]
  },
  'mystery-investor': {
    id: 'mystery-investor',
    title: 'Mystery Investor',
    description: 'A wealthy investor approaches you about expanding your clinic. They want to invest $2000 for a 30% stake.',
    type: 'opportunity' as const,
    emoji: '💰',
    choices: [
      {
        id: 'accept',
        text: 'Accept the investment and expand',
        cost: 0,
        outcomes: [
          {
            probability: 40,
            description: 'The investor is legitimate! Your clinic expands successfully and revenue doubles.',
            cashChange: 2000,
            reputationChange: 15
          },
          {
            probability: 35,
            description: 'The investment helps but the investor is demanding. You gain some benefits.',
            cashChange: 800,
            reputationChange: 5
          },
          {
            probability: 25,
            description: 'The investor turns out to be a scammer. You lose money and your reputation is damaged.',
            cashChange: -1000,
            reputationChange: -10
          }
        ]
      },
      {
        id: 'decline',
        text: 'Decline - maintain full ownership',
        cost: 0,
        outcomes: [
          {
            probability: 100,
            description: 'You maintain control but miss potential growth opportunities.',
            cashChange: 0,
            reputationChange: 0
          }
        ]
      }
    ]
  },
  'influencer-bad-review': {
    id: 'influencer-bad-review',
    title: 'Influencer Bad Review',
    description: 'A popular health influencer visited your clinic and is threatening to post a scathing review about poor service. This could go viral and destroy your reputation!',
    type: 'risk' as const,
    emoji: '📱',
    choices: [
      {
        id: 'pay-pr',
        text: 'Hire PR firm to handle crisis ($500)',
        cost: 500,
        outcomes: [
          {
            probability: 80,
            description: 'PR firm successfully manages the crisis. Reputation damage minimized.',
            cashChange: 0,
            reputationChange: -5
          },
          {
            probability: 20,
            description: 'PR firm fails. The bad review still goes viral.',
            cashChange: 0,
            reputationChange: -30
          }
        ]
      },
      {
        id: 'ignore',
        text: 'Ignore the threat',
        cost: 0,
        outcomes: [
          {
            probability: 70,
            description: 'The bad review goes viral! Your reputation is destroyed.',
            cashChange: 0,
            reputationChange: -40
          },
          {
            probability: 30,
            description: 'The influencer changes their mind and doesn\'t post the review.',
            cashChange: 0,
            reputationChange: 0
          }
        ]
      }
    ]
  },
  'critical-equipment-failure': {
    id: 'critical-equipment-failure',
    title: 'Critical Equipment Failure',
    description: 'Your main dental chair has broken down completely. You need to either repair it immediately or buy new equipment.',
    type: 'risk' as const,
    emoji: '🔧',
    choices: [
      {
        id: 'emergency-repair',
        text: 'Emergency repair service ($300)',
        cost: 300,
        outcomes: [
          {
            probability: 60,
            description: 'Repair successful. Equipment works like new.',
            cashChange: 0,
            reputationChange: 0
          },
          {
            probability: 40,
            description: 'Repair fails. You need to buy new equipment anyway.',
            cashChange: -300,
            reputationChange: -10
          }
        ]
      },
      {
        id: 'buy-new',
        text: 'Buy new equipment ($800)',
        cost: 800,
        outcomes: [
          {
            probability: 100,
            description: 'New equipment installed. Better efficiency and patient satisfaction.',
            cashChange: 0,
            reputationChange: 5
          }
        ]
      },
      {
        id: 'wait',
        text: 'Wait and see (lose 1 chair temporarily)',
        cost: 0,
        outcomes: [
          {
            probability: 100,
            description: 'You lose a treatment chair for several days. Patients are frustrated.',
            cashChange: 0,
            reputationChange: -15
          }
        ]
      }
    ]
  },
  'lawsuit-threat': {
    id: 'lawsuit-threat',
    title: 'Malpractice Lawsuit Threat',
    description: 'A former patient is threatening to sue for malpractice. You need to decide how to handle this serious situation.',
    type: 'risk' as const,
    emoji: '⚖️',
    choices: [
      {
        id: 'settle',
        text: 'Settle out of court ($1000)',
        cost: 1000,
        outcomes: [
          {
            probability: 100,
            description: 'Settlement reached. Case closed but expensive.',
            cashChange: 0,
            reputationChange: -5
          }
        ]
      },
      {
        id: 'fight',
        text: 'Fight in court ($200 legal fees)',
        cost: 200,
        outcomes: [
          {
            probability: 30,
            description: 'You win the case! Your reputation is protected.',
            cashChange: 0,
            reputationChange: 5
          },
          {
            probability: 70,
            description: 'You lose the case. Massive settlement and reputation damage.',
            cashChange: -1800,
            reputationChange: -25
          }
        ]
      },
      {
        id: 'ignore',
        text: 'Ignore the threat',
        cost: 0,
        outcomes: [
          {
            probability: 80,
            description: 'Lawsuit proceeds. You lose badly in court.',
            cashChange: -1500,
            reputationChange: -30
          },
          {
            probability: 20,
            description: 'The patient drops the case. You got lucky.',
            cashChange: 0,
            reputationChange: 0
          }
        ]
      }
    ]
  }
} as const;