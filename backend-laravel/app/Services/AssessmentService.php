<?php

namespace App\Services;

use App\Models\Assessment;
use Carbon\Carbon;

class AssessmentService
{
    public function getQuestions($type)
    {
        $questions = [];

        switch ($type) {
            case 'PHQ-9':
                $questions = [
                    [
                        'id' => 1,
                        'question' => 'Little interest or pleasure in doing things',
                        'options' => [
                            ['value' => 0, 'text' => 'Not at all'],
                            ['value' => 1, 'text' => 'Several days'],
                            ['value' => 2, 'text' => 'More than half the days'],
                            ['value' => 3, 'text' => 'Nearly every day']
                        ]
                    ],
                    [
                        'id' => 2,
                        'question' => 'Feeling down, depressed, or hopeless',
                        'options' => [
                            ['value' => 0, 'text' => 'Not at all'],
                            ['value' => 1, 'text' => 'Several days'],
                            ['value' => 2, 'text' => 'More than half the days'],
                            ['value' => 3, 'text' => 'Nearly every day']
                        ]
                    ],
                    [
                        'id' => 3,
                        'question' => 'Trouble falling or staying asleep, or sleeping too much',
                        'options' => [
                            ['value' => 0, 'text' => 'Not at all'],
                            ['value' => 1, 'text' => 'Several days'],
                            ['value' => 2, 'text' => 'More than half the days'],
                            ['value' => 3, 'text' => 'Nearly every day']
                        ]
                    ],
                    [
                        'id' => 4,
                        'question' => 'Feeling tired or having little energy',
                        'options' => [
                            ['value' => 0, 'text' => 'Not at all'],
                            ['value' => 1, 'text' => 'Several days'],
                            ['value' => 2, 'text' => 'More than half the days'],
                            ['value' => 3, 'text' => 'Nearly every day']
                        ]
                    ],
                    [
                        'id' => 5,
                        'question' => 'Poor appetite or overeating',
                        'options' => [
                            ['value' => 0, 'text' => 'Not at all'],
                            ['value' => 1, 'text' => 'Several days'],
                            ['value' => 2, 'text' => 'More than half the days'],
                            ['value' => 3, 'text' => 'Nearly every day']
                        ]
                    ]
                ];
                break;

            case 'GAD-7':
                $questions = [
                    [
                        'id' => 1,
                        'question' => 'Feeling nervous, anxious, or on edge',
                        'options' => [
                            ['value' => 0, 'text' => 'Not at all'],
                            ['value' => 1, 'text' => 'Several days'],
                            ['value' => 2, 'text' => 'More than half the days'],
                            ['value' => 3, 'text' => 'Nearly every day']
                        ]
                    ],
                    [
                        'id' => 2,
                        'question' => 'Not being able to stop or control worrying',
                        'options' => [
                            ['value' => 0, 'text' => 'Not at all'],
                            ['value' => 1, 'text' => 'Several days'],
                            ['value' => 2, 'text' => 'More than half the days'],
                            ['value' => 3, 'text' => 'Nearly every day']
                        ]
                    ],
                    [
                        'id' => 3,
                        'question' => 'Worrying too much about different things',
                        'options' => [
                            ['value' => 0, 'text' => 'Not at all'],
                            ['value' => 1, 'text' => 'Several days'],
                            ['value' => 2, 'text' => 'More than half the days'],
                            ['value' => 3, 'text' => 'Nearly every day']
                        ]
                    ]
                ];
                break;

            default:
                $questions = [];
        }

        return $questions;
    }

    public function processAssessment($type, $answers, $userId = null, $anonymousSessionId = null)
    {
        $score = array_sum(array_column($answers, 'value'));
        
        $result = $this->interpretScore($type, $score);

        return [
            'score' => $score,
            'label' => $result['label'],
            'severity_level' => $result['severity_level'],
            'recommendations' => $result['recommendations'],
            'next_steps' => $result['next_steps']
        ];
    }

    private function interpretScore($type, $score)
    {
        switch ($type) {
            case 'PHQ-9':
                if ($score <= 4) {
                    return [
                        'label' => 'Minimal Depression',
                        'severity_level' => 'minimal',
                        'recommendations' => [
                            'Continue maintaining healthy lifestyle habits',
                            'Practice regular self-care',
                            'Stay connected with friends and family'
                        ],
                        'next_steps' => [
                            'Consider regular mental health check-ins',
                            'Explore our educational resources'
                        ]
                    ];
                } elseif ($score <= 9) {
                    return [
                        'label' => 'Mild Depression',
                        'severity_level' => 'mild',
                        'recommendations' => [
                            'Consider speaking with a counselor',
                            'Regular exercise and healthy sleep habits',
                            'Mindfulness and relaxation techniques',
                            'Stay socially connected'
                        ],
                        'next_steps' => [
                            'Use our chatbot for immediate support',
                            'Consider professional counseling',
                            'Monitor your symptoms'
                        ]
                    ];
                } elseif ($score <= 14) {
                    return [
                        'label' => 'Moderate Depression',
                        'severity_level' => 'moderate',
                        'recommendations' => [
                            'Professional counseling is recommended',
                            'Consider therapy options',
                            'Maintain regular routine',
                            'Reach out to support networks'
                        ],
                        'next_steps' => [
                            'Schedule a consultation with our staff',
                            'Use our chat support system',
                            'Contact a mental health professional'
                        ]
                    ];
                } else {
                    return [
                        'label' => 'Severe Depression',
                        'severity_level' => 'severe',
                        'recommendations' => [
                            'Immediate professional help is strongly recommended',
                            'Consider speaking with a psychiatrist',
                            'Don\'t hesitate to reach out for support',
                            'Contact crisis helpline if needed'
                        ],
                        'next_steps' => [
                            'Contact emergency services if in crisis',
                            'Speak with our counselors immediately',
                            'Seek professional medical attention'
                        ]
                    ];
                }

            case 'GAD-7':
                if ($score <= 4) {
                    return [
                        'label' => 'Minimal Anxiety',
                        'severity_level' => 'minimal',
                        'recommendations' => [
                            'Continue current coping strategies',
                            'Regular stress management',
                            'Maintain healthy lifestyle'
                        ],
                        'next_steps' => [
                            'Explore relaxation techniques',
                            'Monitor stress levels'
                        ]
                    ];
                } elseif ($score <= 9) {
                    return [
                        'label' => 'Mild Anxiety',
                        'severity_level' => 'mild',
                        'recommendations' => [
                            'Learn anxiety management techniques',
                            'Regular exercise and relaxation',
                            'Consider mindfulness practices'
                        ],
                        'next_steps' => [
                            'Try our guided relaxation resources',
                            'Consider speaking with a counselor'
                        ]
                    ];
                } else {
                    return [
                        'label' => 'Moderate to Severe Anxiety',
                        'severity_level' => 'moderate-severe',
                        'recommendations' => [
                            'Professional counseling recommended',
                            'Consider therapy options',
                            'Practice stress reduction techniques'
                        ],
                        'next_steps' => [
                            'Schedule consultation with our staff',
                            'Contact a mental health professional'
                        ]
                    ];
                }

            default:
                return [
                    'label' => 'Assessment Complete',
                    'severity_level' => 'unknown',
                    'recommendations' => ['Consult with a mental health professional'],
                    'next_steps' => ['Review results with qualified staff']
                ];
        }
    }

    public function getStatistics()
    {
        $totalAssessments = Assessment::count();
        $recentAssessments = Assessment::where('created_at', '>=', Carbon::now()->subDays(30))->count();
        
        $typeDistribution = Assessment::selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->get()
            ->keyBy('type');

        $monthlyTrend = Assessment::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'total_assessments' => $totalAssessments,
            'recent_assessments' => $recentAssessments,
            'type_distribution' => $typeDistribution,
            'monthly_trend' => $monthlyTrend,
            'average_score_by_type' => Assessment::selectRaw('type, AVG(score) as avg_score')
                ->groupBy('type')
                ->get()
                ->keyBy('type')
        ];
    }
}