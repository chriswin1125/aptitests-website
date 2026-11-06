require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Topic = require('./models/Topic');
const Formula = require('./models/Formula');
const Exam = require('./models/Exam');
const Company = require('./models/Company');
const MockTest = require('./models/MockTest');
const DailyChallenge = require('./models/DailyChallenge');
const TestAttempt = require('./models/TestAttempt');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aptitude_pro';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Topic.deleteMany({}),
      Formula.deleteMany({}),
      Exam.deleteMany({}),
      Company.deleteMany({}),
      MockTest.deleteMany({}),
      DailyChallenge.deleteMany({}),
      TestAttempt.deleteMany({})
    ]);

    // 1. Create Users (Admin and Aspirant)
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const studentPassword = await bcrypt.hash('student123', salt);

    const adminUser = await User.create({
      name: 'Dr. Arjun Verma (Platform Admin)',
      email: 'admin@aptitudepro.com',
      password: adminPassword,
      role: 'admin',
      targetExam: 'All Exams (Chief Evaluator)',
      streak: 42,
      savedFormulas: [],
      completedTopics: ['percentage', 'profit-and-loss', 'time-and-work'],
      stats: {
        testsAttempted: 18,
        totalScore: 162,
        totalQuestions: 180,
        correctAnswers: 165,
        totalTimeSpentSec: 14400
      }
    });

    const studentUser = await User.create({
      name: 'Rohan Sharma',
      email: 'aspirant@aptitudepro.com',
      password: studentPassword,
      role: 'user',
      targetExam: 'SBI PO & TCS NQT',
      streak: 7,
      savedFormulas: [],
      completedTopics: ['percentage', 'ratio-and-proportion'],
      stats: {
        testsAttempted: 8,
        totalScore: 68,
        totalQuestions: 80,
        correctAnswers: 70,
        totalTimeSpentSec: 7200
      }
    });

    console.log('Seeded Users: Admin & Student');

    // 2. Comprehensive Topics List
    // We will build rich, in-depth topics with Section 1-7 for core ones and full listings for all required topics
    const topicsData = [
      // Quantitative Aptitude
      {
        name: 'Percentage',
        slug: 'percentage',
        category: 'Quantitative Aptitude',
        icon: 'Percent',
        badge: 'Fundamental',
        importance: 'Critical (Every exam asks 2-5 direct & indirect questions)',
        examUsage: 'Banking (SBI/IBPS PO & Clerk), SSC CGL/CHSL, TCS NQT, Infosys, CAT, UPSC CSAT',
        difficulty: 'Beginner',
        estimatedTime: '2.5 Hours',
        summary: 'Percentage is the mathematical backbone of Profit & Loss, Simple/Compound Interest, and Data Interpretation.',
        description: 'Percentage literally means "per hundred". It expresses numbers as fractions of 100, enabling relative comparison across disparate datasets and financial metrics.',
        concepts: {
          basic: [
            { title: 'Converting Fractions to Percentages', content: 'Multiply the fraction by 100. Key values: 1/2 = 50%, 1/3 = 33.33%, 1/4 = 25%, 1/5 = 20%, 1/6 = 16.66%, 1/7 = 14.28%, 1/8 = 12.5%, 1/9 = 11.11%, 1/11 = 9.09%.' },
            { title: 'Percentage of a Quantity', content: 'x% of Y = (x / 100) * Y. Note the commutativity: x% of Y is always equal to Y% of x (e.g., 16% of 50 = 50% of 16 = 8).' }
          ],
          intermediate: [
            { title: 'Percentage Increase and Decrease', content: '% Change = [(New Value - Initial Value) / Initial Value] * 100. If a number increases by x%, the multiplier is (1 + x/100).' },
            { title: 'Product Constancy Ratio (AB Rule)', content: 'If A * B = Constant, and A increases by x/y, then B must decrease by x/(x + y) to keep the product unchanged. Used heavily in Price * Consumption = Expenditure.' }
          ],
          advanced: [
            { title: 'Successive Percentage Changes', content: 'When a quantity changes by a% followed by b%, the effective overall percentage change = a + b + (a * b)/100.' },
            { title: 'Compound Percentage in Population and Depreciation', content: 'Value after n periods = P * (1 ± r/100)^n.' }
          ],
          shortcuts: [
            { title: 'Commutative Percentage Flip', trick: 'x% of y = y% of x', example: 'Find 64% of 25 -> Compute 25% of 64 = 64/4 = 16 instantly.' },
            { title: 'Net Change Formula', trick: 'a + b + (ab/100)%', example: 'Price increases by 20% then drops by 10%: 20 - 10 + (20*-10)/100 = 10 - 2 = +8% net increase.' }
          ],
          commonMistakes: [
            { mistake: 'Calculating percentage change over the new value instead of original base.', correction: 'Always divide difference by the ORIGINAL (initial) baseline value.' },
            { mistake: 'Assuming +20% followed by -20% brings you back to 100%.', correction: 'It actually results in 100 -> 120 -> 96 (a 4% net loss).' }
          ]
        },
        formulas: [
          {
            name: 'Basic Percentage',
            expression: 'P = (Value / Total Value) * 100',
            explanation: 'Gives the proportion per hundred units.',
            variables: [{ symbol: 'P', meaning: 'Percentage' }, { symbol: 'Value', meaning: 'Part under consideration' }, { symbol: 'Total', meaning: 'Whole baseline' }],
            whenToUse: 'When finding what percentage part A is of whole B.',
            solvedExample: 'In an exam of 500 marks, Rahul scored 375 marks. % = (375/500)*100 = 75%.'
          },
          {
            name: 'Successive Change',
            expression: 'Net % = a + b + (a * b) / 100',
            explanation: 'Gives effective change after two consecutive percentage changes.',
            variables: [{ symbol: 'a', meaning: 'First percentage change (+ or -)' }, { symbol: 'b', meaning: 'Second percentage change (+ or -)' }],
            whenToUse: 'When discounts or price hikes are applied one after another.',
            solvedExample: 'Two successive discounts of 20% and 10%: (-20) + (-10) + ((-20)*(-10))/100 = -30 + 2 = -28% effective discount.'
          }
        ],
        solvedExamples: [
          {
            title: 'Expenditure Balance Example',
            question: 'The price of sugar rises by 25%. By what percentage should a household reduce its consumption so that total expenditure remains unchanged?',
            solution: 'Using the AB rule: Price increases by 25% = 1/4. Consumption must decrease by 1 / (4 + 1) = 1/5 = 20%.',
            explanation: 'Expenditure = Price * Consumption. If P becomes 5/4 of original, C must become 4/5 of original (a drop of 1/5 = 20%).',
            shortcut: 'Formula: [R / (100 + R)] * 100 = [25 / 125] * 100 = 20%.',
            finalAnswer: '20%'
          },
          {
            title: 'Exam Score Boundary',
            question: 'A candidate who gets 30% marks fails by 15 marks. Another candidate who gets 40% marks scores 35 marks more than the minimum pass mark. Find maximum marks.',
            solution: 'Difference in percentage = 40% - 30% = 10%. Difference in actual marks = 35 - (-15) = 50 marks. 10% = 50 marks => 100% = 500 marks.',
            explanation: 'Let maximum marks be M. 0.40M - 0.30M = 50 => 0.10M = 50 => M = 500.',
            shortcut: 'Direct ratio: 10% corresponds to 50 marks, so multiply by 10 to get 100% = 500.',
            finalAnswer: '500 marks'
          },
          {
            title: 'Two Successive Discounts',
            question: 'An article marked at Rs. 800 is sold at two successive discounts of 10% and 15%. What is the selling price?',
            solution: 'First discount of 10% on 800 = 80 => Price becomes 720. Second discount of 15% on 720 = 108 => Selling price = 720 - 108 = Rs. 612.',
            explanation: 'Net multiplier = 0.90 * 0.85 = 0.765. SP = 800 * 0.765 = 612.',
            shortcut: 'Net discount = 10 + 15 - 1.5 = 23.5%. 800 - 23.5% of 800 = 800 - 188 = Rs. 612.',
            finalAnswer: 'Rs. 612'
          },
          {
            title: 'Population Growth Rate',
            question: 'The population of a town is 1,20,000. It increases by 10% in the first year and decreases by 5% in the second year. What is the population after 2 years?',
            solution: 'Population after 1st year = 1,20,000 * 1.10 = 1,32,000. After 2nd year = 1,32,000 * 0.95 = 1,25,400.',
            explanation: 'Combined multiplier = 1.10 * 0.95 = 1.045. 1,20,000 * 1.045 = 1,25,400.',
            shortcut: 'Net % change = 10 - 5 - (10*5)/100 = 5 - 0.5 = +4.5%. 120000 + 4.5%(120000) = 1,25,400.',
            finalAnswer: '1,25,400'
          },
          {
            title: 'Voter Election Margin',
            question: 'In an election between two candidates, the winner got 58% of valid votes and won by a majority of 2,400 votes. Find the total number of valid votes cast.',
            solution: 'Winner = 58%, Loser = 42%. Difference in votes = 58% - 42% = 16%. 16% of Total = 2,400 => Total = 2,400 / 0.16 = 15,000.',
            explanation: 'The majority equals the percentage margin between the winner and runner-up.',
            shortcut: 'Total = (Majority Margin / 16) * 100 = 150 * 100 = 15,000.',
            finalAnswer: '15,000'
          }
        ],
        practiceQuestions: [
          {
            id: 'pq_pct_1',
            question: 'If A’s salary is 20% more than B’s salary, then B’s salary is how much percent less than A’s salary?',
            options: ['16.67%', '20%', '25%', '15%'],
            correctAnswer: 0,
            difficulty: 'Beginner',
            previousExamRef: 'SSC CGL Tier 1',
            explanation: 'Using AB rule: A is 1/5 more than B, so B is 1/(5+1) = 1/6 less than A = 16.67%.'
          },
          {
            id: 'pq_pct_2',
            question: 'When the price of cloth was reduced by 25%, the quantity of cloth sold increased by 20%. What was the effect on gross receipts of the shop?',
            options: ['5% decrease', '10% decrease', '5% increase', 'No change'],
            correctAnswer: 1,
            difficulty: 'Intermediate',
            previousExamRef: 'IBPS PO Prelims',
            explanation: 'Net change = -25 + 20 + (-25 * 20)/100 = -5 - 5 = -10% (10% decrease).'
          },
          {
            id: 'pq_pct_3',
            question: 'In a college election, 10% voters did not vote and 60 votes were declared invalid. The successful candidate got 47% of total votes and won by 308 votes. Total votes?',
            options: ['6,200', '5,800', '6,400', '5,400'],
            correctAnswer: 0,
            difficulty: 'Advanced',
            previousExamRef: 'SBI PO Mains',
            explanation: 'Let total votes = 100x. Voted = 90x. Valid = 90x - 60. Winner = 47x. Loser = 90x - 60 - 47x = 43x - 60. Difference: 47x - (43x - 60) = 308 => 4x + 60 = 308 => 4x = 248 => x = 62. Total votes = 100 * 62 = 6,200.'
          },
          {
            id: 'pq_pct_4',
            question: 'A student scored 28% marks and failed by 14 marks. If the passing percentage is 35%, find the maximum marks for the test.',
            options: ['200', '250', '300', '400'],
            correctAnswer: 0,
            difficulty: 'Beginner',
            previousExamRef: 'TCS NQT',
            explanation: 'Passing % - Scored % = 35% - 28% = 7%. 7% corresponds to 14 marks. Maximum marks = (14 / 7) * 100 = 200.'
          }
        ],
        testQuestions: [
          {
            id: 'tq_pct_1',
            question: 'If 80% of A = 50% of B and B = x% of A, then the value of x is:',
            options: ['160', '150', '120', '80'],
            correctAnswer: 0,
            explanation: '80A = 50B => B = (8/5)A = 1.6A. Since B = x% of A, x = 160%.'
          },
          {
            id: 'tq_pct_2',
            question: 'The salary of a person is first increased by 10% and then it is decreased by 10%. The percentage change in his salary is:',
            options: ['1% decrease', '1% increase', '0%', '2% decrease'],
            correctAnswer: 0,
            explanation: 'Net change = +10 - 10 + (10 * -10)/100 = -1% (1% decrease).'
          },
          {
            id: 'tq_pct_3',
            question: 'A fruit seller had some apples. He sells 40% apples and still has 420 apples. Originally, he had how many apples?',
            options: ['588', '600', '700', '672'],
            correctAnswer: 2,
            explanation: 'Remaining apples = 100% - 40% = 60%. If 60% = 420, then 100% = (420 / 60) * 100 = 700.'
          },
          {
            id: 'tq_pct_4',
            question: 'Two numbers are respectively 20% and 50% more than a third number. The ratio of the two numbers is:',
            options: ['2 : 5', '3 : 5', '4 : 5', '6 : 7'],
            correctAnswer: 2,
            explanation: 'Let third number = 100. First = 120, Second = 150. Ratio = 120 : 150 = 4 : 5.'
          },
          {
            id: 'tq_pct_5',
            question: 'A number is increased by 20% and then decreased by 20%. The final value is 16 less than original. What was the original number?',
            options: ['400', '350', '500', '600'],
            correctAnswer: 0,
            explanation: 'Net % change = -4%. 4% of original = 16 => Original = (16 / 4) * 100 = 400.'
          }
        ]
      },
      {
        name: 'Profit and Loss',
        slug: 'profit-and-loss',
        category: 'Quantitative Aptitude',
        icon: 'TrendingUp',
        badge: 'High Frequency',
        importance: 'High (Core commercial math topic across all tests)',
        examUsage: 'IBPS PO/Clerk, SBI PO/Clerk, SSC CGL, TCS, Infosys, Capgemini, UPSC',
        difficulty: 'Intermediate',
        estimatedTime: '3.0 Hours',
        summary: 'Master Cost Price, Selling Price, Marked Price, Discount, Dishonest dealers, and markup relations.',
        description: 'Commercial transactions are governed by the relationship between cost of production (CP) and realization value (SP). Understanding base values is crucial to avoiding mistakes.',
        concepts: {
          basic: [
            { title: 'Cost Price (CP) & Selling Price (SP)', content: 'Profit = SP - CP (when SP > CP). Loss = CP - SP (when CP > SP). Profit% and Loss% are ALWAYS calculated on Cost Price unless stated otherwise.' }
          ],
          intermediate: [
            { title: 'Marked Price (MP) & Discounts', content: 'Discount = MP - SP. Discount % = (Discount / MP) * 100. Relation: CP * (100 + P%) = MP * (100 - D%).' },
            { title: 'Dishonest Dealer Concept', content: 'Profit % = [Error in Weight / (True Weight - Error in Weight)] * 100.' }
          ],
          advanced: [
            { title: 'Selling Two Items at Same SP', content: 'When two articles are sold at the same SP, one at a profit of x% and other at loss of x%, there is always an overall loss = (x / 10)^2 %.' }
          ],
          shortcuts: [
            { title: 'Same SP with Equal Gain & Loss', trick: 'Always Loss = (x/10)^2 %', example: 'Sold two TVs at Rs. 10,000 each; 20% gain on one, 20% loss on other: Net loss = (20/10)^2 = 4%.' }
          ],
          commonMistakes: [
            { mistake: 'Calculating discount percentage on cost price.', correction: 'Discount is strictly computed on Marked Price (MP).' }
          ]
        },
        formulas: [
          {
            name: 'Profit Percentage',
            expression: 'Profit % = [(SP - CP) / CP] * 100',
            explanation: 'Measures net return against cost investment.',
            variables: [{ symbol: 'SP', meaning: 'Selling Price' }, { symbol: 'CP', meaning: 'Cost Price' }],
            whenToUse: 'When computing financial return on an item.',
            solvedExample: 'CP = 400, SP = 500. Profit% = (100/400)*100 = 25%.'
          },
          {
            name: 'Markup & Discount Link',
            expression: 'CP / MP = (100 - Discount %) / (100 + Profit %)',
            explanation: 'Directly relates CP and Marked Price without requiring individual intermediate prices.',
            variables: [{ symbol: 'CP', meaning: 'Cost Price' }, { symbol: 'MP', meaning: 'Marked Price' }],
            whenToUse: 'When both discount % and profit % are specified.',
            solvedExample: 'Discount 10%, Profit 20%: CP/MP = 90/120 = 3/4.'
          }
        ],
        solvedExamples: [
          {
            title: 'Same SP Equal Gain & Loss',
            question: 'A merchant sold two cycles for Rs. 2,400 each. On one he gained 20% and on the other he lost 20%. Find his overall gain or loss percentage.',
            solution: 'Whenever two items are sold at the same selling price with x% gain and x% loss, there is ALWAYS a loss given by (x/10)^2 %. Here x = 20, so Loss % = (20/10)^2 = 4%.',
            explanation: 'Cost price of cycle 1 = 2400 / 1.20 = 2000. Cost price of cycle 2 = 2400 / 0.80 = 3000. Total CP = 5000, Total SP = 4800. Net loss = 200 on 5000 = 4%.',
            shortcut: 'Formula: (20/10)^2 = 4% loss.',
            finalAnswer: '4% loss'
          },
          {
            title: 'Dishonest Grocer Metric',
            question: 'A shopkeeper professes to sell his goods at cost price, but uses a false weight of 950 grams for each kilogram. Find his gain percentage.',
            solution: 'Gain % = [Error / (True Value - Error)] * 100 = [50 / 950] * 100 = 500 / 95 = 5.26% (or 5 5/19%).',
            explanation: 'The shopkeeper gives goods worth 950g but collects price of 1000g, thus earning a 50g margin over 950g cost.',
            shortcut: '50/950 * 100 = 5.26%.',
            finalAnswer: '5.26%'
          },
          {
            title: 'Marked Price for Desired Margin',
            question: 'By how much percent above the cost price should a merchant mark his goods so as to gain 17% after allowing a discount of 10% to the customer?',
            solution: 'Using CP/MP formula: CP/MP = (100 - D)/(100 + P) = (100 - 10)/(100 + 17) = 90 / 117 = 10 / 13. Markup = (13 - 10)/10 * 100 = 30%.',
            explanation: 'If CP is 100, SP required is 117. With a 10% discount, 0.90 * MP = 117 => MP = 130. Markup = 30%.',
            shortcut: 'Markup = [(P + D) / (100 - D)] * 100 = (27 / 90) * 100 = 30%.',
            finalAnswer: '30%'
          },
          {
            title: 'Successive Trading Margins',
            question: 'A manufacturer sells a bicycle to a wholesaler at 20% profit, who sells it to a retailer at 10% profit. If the retailer pays Rs. 3,300, find the manufacturing cost.',
            solution: 'Let manufacturing cost = C. Retailer price = C * 1.20 * 1.10 = 1.32C = 3300. C = 3300 / 1.32 = Rs. 2,500.',
            explanation: 'Chain multiplication across trading nodes gives the final price directly.',
            shortcut: 'C = 3300 / (1.2 * 1.1) = 3300 / 1.32 = 2500.',
            finalAnswer: 'Rs. 2,500'
          },
          {
            title: 'Faulty Pricing Breakdown',
            question: 'If selling price is doubled, the profit triples. Find the initial profit percentage.',
            solution: 'Let initial CP = c, SP = s. Initial profit = s - c. When SP doubles (2s), new profit = 2s - c. Given 2s - c = 3(s - c) => 2s - c = 3s - 3c => s = 2c. Initial profit % = (2c - c)/c * 100 = 100%.',
            explanation: 'Algebraic substitution confirms SP was initially twice the CP.',
            shortcut: 's = 2c => 100% profit.',
            finalAnswer: '100%'
          }
        ],
        practiceQuestions: [
          {
            id: 'pq_pl_1',
            question: 'A person incurs 5% loss by selling a watch for Rs. 1,140. At what price should the watch be sold to earn 5% profit?',
            options: ['Rs. 1,260', 'Rs. 1,240', 'Rs. 1,280', 'Rs. 1,220'],
            correctAnswer: 0,
            difficulty: 'Beginner',
            previousExamRef: 'SSC CHSL',
            explanation: '95% of CP = 1140 => CP = 1140/0.95 = 1200. To get 5% profit: SP = 1200 * 1.05 = Rs. 1,260.'
          },
          {
            id: 'pq_pl_2',
            question: 'A cloth merchant sells cloth at a 10% discount on marked price. If marked price is 20% higher than cost price, what is his profit percentage?',
            options: ['8%', '10%', '12%', '7.5%'],
            correctAnswer: 0,
            difficulty: 'Intermediate',
            previousExamRef: 'IBPS Clerk',
            explanation: 'Let CP = 100 => MP = 120. SP = 120 * 0.90 = 108. Profit = 8%.'
          }
        ],
        testQuestions: [
          {
            id: 'tq_pl_1',
            question: 'A man buys an item for Rs. 250 and sells it for Rs. 300. His profit percentage is:',
            options: ['20%', '25%', '15%', '18%'],
            correctAnswer: 0,
            explanation: 'Profit = 50. Profit% = (50/250)*100 = 20%.'
          },
          {
            id: 'tq_pl_2',
            question: 'If the cost price of 12 pens is equal to the selling price of 8 pens, the gain percentage is:',
            options: ['50%', '33.33%', '25%', '40%'],
            correctAnswer: 0,
            explanation: '12 CP = 8 SP => SP/CP = 12/8 = 3/2. Gain % = (3-2)/2 * 100 = 50%.'
          }
        ]
      },
      {
        name: 'Simple Interest',
        slug: 'simple-interest',
        category: 'Quantitative Aptitude',
        icon: 'Coins',
        badge: 'Formula Heavy',
        importance: 'High (Asked in all Banking & SSC tests)',
        examUsage: 'SBI PO, IBPS PO, RRB NTPC, SSC CGL, Campus recruitment',
        difficulty: 'Beginner',
        estimatedTime: '2.0 Hours',
        summary: 'Understand constant rate accretion, principle multiplication, and installment payments.',
        description: 'Simple interest accrues uniformly solely on the original principal sum over time, without interest compounding.',
        concepts: {
          basic: [
            { title: 'The Fundamental Formula', content: 'SI = (P * R * T) / 100. Amount (A) = P + SI = P * [1 + (R * T)/100].' }
          ],
          intermediate: [
            { title: 'Sum Becomes N Times in T Years', content: 'If a sum doubles in T years, SI = P, so R = 100 / T. In general: R * T = (N - 1) * 100.' }
          ],
          advanced: [
            { title: 'Installments in Simple Interest', content: 'Annual payment A = [100 * Debt] / [100T + R*T*(T - 1)/2].' }
          ],
          shortcuts: [
            { title: 'Sum Multiplication Rule', trick: 'R * T = (N - 1) * 100', example: 'Sum trebles (N=3) in 8 years: R * 8 = (3 - 1)*100 = 200 => R = 25%.' }
          ],
          commonMistakes: [
            { mistake: 'Forgetting to convert time in months/days into years.', correction: 'Always divide months by 12 and days by 365.' }
          ]
        },
        formulas: [
          {
            name: 'Simple Interest Formula',
            expression: 'SI = (P * R * T) / 100',
            explanation: 'Calculates interest earned over T years at annual rate R%.',
            variables: [{ symbol: 'P', meaning: 'Principal' }, { symbol: 'R', meaning: 'Annual rate of interest' }, { symbol: 'T', meaning: 'Time period in years' }],
            whenToUse: 'When interest is uncompounded.',
            solvedExample: 'P = 5000, R = 10%, T = 3 yrs => SI = (5000*10*3)/100 = 1500.'
          }
        ],
        solvedExamples: [
          {
            title: 'Rate Calculation for Doubling Sum',
            question: 'A sum of money doubles itself in 10 years at simple interest. What is the annual rate of interest?',
            solution: 'If sum doubles, SI = P. P = (P * R * 10)/100 => 1 = 10R / 100 => R = 10%.',
            explanation: 'Direct shortcut: R = 100 / T = 100 / 10 = 10% per annum.',
            shortcut: 'R = (N - 1) * 100 / T = (2 - 1)*100 / 10 = 10%.',
            finalAnswer: '10%'
          },
          {
            title: 'Multiple Time Frame Accumulation',
            question: 'A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. The principal sum is:',
            solution: 'Interest for 1 year = 854 - 815 = Rs. 39. Interest for 3 years = 39 * 3 = Rs. 117. Principal = 815 - 117 = Rs. 698.',
            explanation: 'Because simple interest grows uniformly, the yearly difference yields the annual interest directly.',
            shortcut: 'Principal = Amount_3 - 3 * (Amount_4 - Amount_3) = 815 - 117 = 698.',
            finalAnswer: 'Rs. 698'
          },
          {
            title: 'Splitting Principal at Different Rates',
            question: 'A sum of Rs. 1,550 was lent partly at 5% and partly at 8% simple interest. The total interest received after 3 years was Rs. 300. The ratio of money lent at 5% to that at 8% is:',
            solution: 'Average interest per year = 300 / 3 = 100. Overall rate = (100 / 1550) * 100 = 200/31 %. Using Allegation: (8 - 200/31) : (200/31 - 5) = 48/31 : 45/31 = 16 : 15.',
            explanation: 'Mixtures & Allegations provides an immediate ratio of investments.',
            shortcut: 'Ratio = 16 : 15.',
            finalAnswer: '16 : 15'
          },
          {
            title: 'Time to Quadruple',
            question: 'A sum amounts to 4 times itself in 15 years. In how many years will it become 7 times itself at the same rate?',
            solution: 'SI_1 = 4P - P = 3P in 15 years. Time per 1P interest = 15 / 3 = 5 years. For 7 times, SI_2 = 6P. Time required = 6 * 5 = 30 years.',
            explanation: '(T1 / T2) = (N1 - 1) / (N2 - 1) => 15 / T2 = 3 / 6 = 1/2 => T2 = 30 years.',
            shortcut: '15 / 3 = 5 yrs per unit; 6 units need 30 yrs.',
            finalAnswer: '30 years'
          },
          {
            title: 'True Worth and Banker Gain',
            question: 'What equal annual installment will discharge a debt of Rs. 4,600 due in 4 years at 10% simple interest?',
            solution: 'Installment = [4600 * 100] / [100*4 + 10*4*3/2] = 460000 / [400 + 60] = 460000 / 460 = Rs. 1,000.',
            explanation: 'Each installment earns interest for the remaining years before maturity.',
            shortcut: 'Direct installment formula gives Rs. 1,000.',
            finalAnswer: 'Rs. 1,000'
          }
        ],
        practiceQuestions: [
          {
            id: 'pq_si_1',
            question: 'How long will it take for a sum of money to grow from Rs. 1,250 to Rs. 10,000 if invested at 12.5% simple interest per year?',
            options: ['56 years', '60 years', '48 years', '64 years'],
            correctAnswer: 0,
            difficulty: 'Intermediate',
            previousExamRef: 'SBI Clerk',
            explanation: 'SI = 10000 - 1250 = 8750. T = (8750 * 100) / (1250 * 12.5) = 56 years.'
          }
        ],
        testQuestions: [
          {
            id: 'tq_si_1',
            question: 'A sum of money doubles itself in 5 years at simple interest. It will become 4 times itself in:',
            options: ['15 years', '12 years', '10 years', '20 years'],
            correctAnswer: 0,
            explanation: '(T1/T2) = (2-1)/(4-1) = 1/3 => T2 = 5 * 3 = 15 years.'
          }
        ]
      },
      {
        name: 'Compound Interest',
        slug: 'compound-interest',
        category: 'Quantitative Aptitude',
        icon: 'BarChart2',
        badge: 'High Weightage',
        importance: 'High (Tests calculation tricks and CI vs SI difference)',
        examUsage: 'SBI PO, IBPS PO Mains, SSC CGL Tier 2, UPSC, TCS',
        difficulty: 'Intermediate',
        estimatedTime: '3.0 Hours',
        summary: 'Compound Interest introduces interest on interest, effective annual rate, and half-yearly compounding.',
        description: 'Compound interest computes interest on both the initial principal and the accumulated interest from previous periods.',
        concepts: {
          basic: [
            { title: 'The Compound Amount Formula', content: 'Amount A = P * (1 + R/100)^T. CI = A - P.' }
          ],
          intermediate: [
            { title: 'Half-Yearly & Quarterly Compounding', content: 'For half-yearly: Rate becomes R/2, Time becomes 2T. For quarterly: Rate becomes R/4, Time becomes 4T.' }
          ],
          advanced: [
            { title: 'Difference between CI and SI', content: 'For 2 years: Diff = P * (R/100)^2. For 3 years: Diff = P * (R/100)^2 * (3 + R/100).' }
          ],
          shortcuts: [
            { title: '2-Year CI vs SI Direct Ratio', trick: 'Difference = P * (R/100)^2', example: 'P = 10,000, R = 5%: Diff = 10000 * 0.05^2 = Rs. 25.' }
          ],
          commonMistakes: [
            { mistake: 'Forgetting to double the number of conversion periods when interest is compounded half-yearly.', correction: 'If time is 1.5 years half-yearly, n = 3 periods, rate = R/2.' }
          ]
        },
        formulas: [
          {
            name: 'Compound Interest Formula',
            expression: 'A = P * (1 + R / 100)^T',
            explanation: 'Calculates the future accumulated amount with annual compounding.',
            variables: [{ symbol: 'P', meaning: 'Principal' }, { symbol: 'R', meaning: 'Annual rate' }, { symbol: 'T', meaning: 'Number of years' }],
            whenToUse: 'When interest reinvests at the end of each period.',
            solvedExample: 'P = 1000, R = 10%, T = 2 yrs => A = 1000 * 1.21 = 1210. CI = 210.'
          },
          {
            name: 'Difference for 2 Years (CI - SI)',
            expression: 'Diff = P * (R / 100)^2',
            explanation: 'Instantly computes difference between compound and simple interest over 2 years.',
            variables: [{ symbol: 'Diff', meaning: 'CI - SI' }, { symbol: 'P', meaning: 'Principal' }, { symbol: 'R', meaning: 'Rate' }],
            whenToUse: 'Directly solve 2-year comparison questions in 5 seconds.',
            solvedExample: 'P = 5000, R = 10% => Diff = 5000 * (0.10)^2 = Rs. 50.'
          }
        ],
        solvedExamples: [
          {
            title: 'CI vs SI 2-Year Difference',
            question: 'The difference between simple and compound interest on Rs. 1,200 for one year at 10% per annum compounded half-yearly is:',
            solution: 'For half-yearly, R = 5%, n = 2 periods. Diff for 2 periods = P * (r/100)^2 = 1200 * (5/100)^2 = 1200 * (1/400) = Rs. 3.',
            explanation: 'The difference between CI and SI over 2 compounding periods equals P*(r/100)^2.',
            shortcut: '1200 * (0.05)^2 = 1200 * 0.0025 = Rs. 3.',
            finalAnswer: 'Rs. 3'
          },
          {
            title: 'Sum Doubling in CI',
            question: 'A sum of money invested at compound interest doubles itself in 5 years. In how many years will it become 8 times itself?',
            solution: 'In CI, 8 = 2^3. If 2^1 takes 5 years, then 2^3 takes 5 * 3 = 15 years.',
            explanation: 'Compound interest follows geometric growth. The power of multiplier scales the time linearly.',
            shortcut: 'Time = 5 * 3 = 15 years.',
            finalAnswer: '15 years'
          },
          {
            title: '3-Year Rate Extraction',
            question: 'At what rate percent per annum will Rs. 2,000 amount to Rs. 2,662 in 3 years, interest being compounded yearly?',
            solution: 'A / P = 2662 / 2000 = 1331 / 1000. Take cube root: 11 / 10 = 1 + R/100 => R/100 = 1/10 => R = 10%.',
            explanation: 'Taking the n-th root of Amount/Principal gives the one-period multiplier.',
            shortcut: 'Cube root of (1331/1000) = 1.10 => 10%.',
            finalAnswer: '10%'
          },
          {
            title: 'Successive Rate Years',
            question: 'What will be the compound interest on a sum of Rs. 25,000 after 3 years at the rate of 12% for the first year, 10% for the second year, and 5% for the third year?',
            solution: 'Amount = 25000 * (1.12) * (1.10) * (1.05) = 25000 * 1.2936 = Rs. 32,340. CI = 32,340 - 25,000 = Rs. 7,340.',
            explanation: 'Multiply the principal by successive yearly multipliers.',
            shortcut: '25000 * 1.12 * 1.1 * 1.05 = 32,340 => CI = 7,340.',
            finalAnswer: 'Rs. 7,340'
          },
          {
            title: 'Finding Principal from 2 Consecutive Years',
            question: 'A sum of money at compound interest amounts to Rs. 669 in 3 years and to Rs. 1,003.50 in 6 years. Find the sum.',
            solution: 'Ratio of 6-year to 3-year amount = 1003.50 / 669 = 1.5 = 3/2. In CI, ratio over equal intervals is constant. P * (3/2) = 669 => P = 669 * (2/3) = Rs. 446.',
            explanation: 'Geometric sequence property: A3 / P = A6 / A3.',
            shortcut: 'P = (A3)^2 / A6 = (669 * 669) / 1003.5 = 446.',
            finalAnswer: 'Rs. 446'
          }
        ],
        practiceQuestions: [
          {
            id: 'pq_ci_1',
            question: 'The compound interest on Rs. 30,000 at 7% per annum is Rs. 4,347. The period (in years) is:',
            options: ['2 years', '2.5 years', '3 years', '4 years'],
            correctAnswer: 0,
            difficulty: 'Intermediate',
            previousExamRef: 'SSC CGL',
            explanation: 'Amount = 34,347. 34347 / 30000 = 11449 / 10000 = (107/100)^2. Hence, 2 years.'
          }
        ],
        testQuestions: [
          {
            id: 'tq_ci_1',
            question: 'The difference between simple and compound interest on Rs. 5,000 for 2 years at 10% per annum is:',
            options: ['Rs. 50', 'Rs. 100', 'Rs. 25', 'Rs. 75'],
            correctAnswer: 0,
            explanation: 'Diff = P * (R/100)^2 = 5000 * (0.1)^2 = 5000 * 0.01 = Rs. 50.'
          }
        ]
      },
      {
        name: 'Time and Work',
        slug: 'time-and-work',
        category: 'Quantitative Aptitude',
        icon: 'Clock',
        badge: 'High Frequency',
        importance: 'Critical (Asked in every single competitive and placement exam)',
        examUsage: 'TCS, Infosys, Wipro, Accenture, SBI PO, SSC CGL, CAT',
        difficulty: 'Intermediate',
        estimatedTime: '3.0 Hours',
        summary: 'Efficiency-based LCM method solves 90% of Time and Work problems in under 45 seconds.',
        description: 'Time and work problems deal with the rate at which agents complete tasks, either individually or in collaboration.',
        concepts: {
          basic: [
            { title: 'The Efficiency (LCM) Method', content: 'Let Total Work = LCM of individual days. Daily Work (Efficiency) = Total Work / Days.' }
          ],
          intermediate: [
            { title: 'Man-Days-Hours Formula (MDH)', content: '(M1 * D1 * H1) / W1 = (M2 * D2 * H2) / W2.' },
            { title: 'Alternate Days Working', content: 'Calculate cycle work (e.g. 2-day work = Eff_A + Eff_B) and divide total work by cycle work.' }
          ],
          advanced: [
            { title: 'Wages Distribution', content: 'Wages are distributed strictly in the ratio of actual work done (or efficiency ratio when time is equal).' }
          ],
          shortcuts: [
            { title: 'Two Person Joint Work', trick: '(A * B) / (A + B)', example: 'A does in 10 days, B in 15 days: (10 * 15) / (10 + 15) = 150 / 25 = 6 days.' }
          ],
          commonMistakes: [
            { mistake: 'Adding the days directly (e.g. 10 days + 15 days = 25 days).', correction: 'Never add days! Add efficiencies: 1/10 + 1/15 = 1/6 (6 days).' }
          ]
        },
        formulas: [
          {
            name: 'Joint Work Formula',
            expression: 'Days together = (A * B) / (A + B)',
            explanation: 'Gives time taken when two individuals work concurrently.',
            variables: [{ symbol: 'A', meaning: 'Days taken by person A' }, { symbol: 'B', meaning: 'Days taken by person B' }],
            whenToUse: 'Quick calculation for two workers.',
            solvedExample: 'A=12, B=6 => (12*6)/(12+6) = 72/18 = 4 days.'
          },
          {
            name: 'MDH Work Equation',
            expression: '(M1 * D1 * H1 * E1) / W1 = (M2 * D2 * H2 * E2) / W2',
            explanation: 'Balances workers, days, daily hours, and efficiencies across workloads.',
            variables: [{ symbol: 'M', meaning: 'Men' }, { symbol: 'D', meaning: 'Days' }, { symbol: 'H', meaning: 'Hours' }, { symbol: 'W', meaning: 'Work output' }],
            whenToUse: 'Comparing groups of men/women/machines working on projects.',
            solvedExample: '15 men work 8h for 20d to build 1 wall. How many men working 6h for 10d build 2 walls? (15*8*20)/1 = (M2*6*10)/2 => 2400 = 30 M2 => M2 = 80 men.'
          }
        ],
        solvedExamples: [
          {
            title: 'LCM Method Demonstration',
            question: 'A can do a work in 15 days and B in 20 days. If they work on it together for 4 days, what fraction of work is left?',
            solution: 'Total Work = LCM(15, 20) = 60 units. A’s efficiency = 60/15 = 4 units/day. B’s efficiency = 60/20 = 3 units/day. Combined = 4 + 3 = 7 units/day. In 4 days, work done = 4 * 7 = 28 units. Work left = 60 - 28 = 32 units. Fraction left = 32 / 60 = 8/15.',
            explanation: 'Converting to unit work avoids complicated fraction additions.',
            shortcut: 'Work done = 4 * (1/15 + 1/20) = 4 * (7/60) = 7/15. Left = 1 - 7/15 = 8/15.',
            finalAnswer: '8/15'
          },
          {
            title: 'Alternate Days Operation',
            question: 'A can finish a work in 12 days and B in 16 days. They work on alternate days starting with A. In how many days will the work be completed?',
            solution: 'Total work = LCM(12, 16) = 48 units. A = 4 units/day, B = 3 units/day. 2-day cycle = 4 + 3 = 7 units. 6 cycles (12 days) = 6 * 7 = 42 units. Remaining = 48 - 42 = 6 units. Day 13 (A works): completes 4 units (Remaining = 2 units). Day 14 (B works): B does 3 units/day, so takes 2/3 day. Total time = 13 + 2/3 = 13 2/3 days.',
            explanation: 'Group alternating workers into discrete integer multi-day cycles.',
            shortcut: '13 2/3 days.',
            finalAnswer: '13 2/3 days'
          },
          {
            title: 'Worker Leaving Midway',
            question: 'A and B can do a piece of work in 45 and 40 days respectively. They began the work together, but A leaves after some days and B finished the remaining work in 23 days. After how many days did A leave?',
            solution: 'Total work = LCM(45, 40) = 360 units. A’s rate = 8 units/day, B’s rate = 9 units/day. B worked alone for 23 days: 23 * 9 = 207 units. Remaining work done jointly = 360 - 207 = 153 units. Joint rate = 8 + 9 = 17 units/day. Days worked together = 153 / 17 = 9 days. Thus, A left after 9 days.',
            explanation: 'Calculate the isolated work completed by the last worker first, then determine the initial joint duration.',
            shortcut: 'Days together = (360 - 23*9) / 17 = 153 / 17 = 9 days.',
            finalAnswer: '9 days'
          },
          {
            title: 'Efficiency Ratio Scaling',
            question: 'A is thrice as good a workman as B and therefore is able to finish a job in 60 days less than B. Working together, they can do it in:',
            solution: 'Ratio of efficiencies A : B = 3 : 1. Ratio of days taken = 1 : 3. Difference in days = 3x - x = 2x = 60 => x = 30. A takes 30 days, B takes 90 days. Joint days = (30 * 90) / (30 + 90) = 2700 / 120 = 22.5 days.',
            explanation: 'Time taken is inversely proportional to efficiency.',
            shortcut: 'Time = 90 / 4 = 22.5 days.',
            finalAnswer: '22.5 days'
          },
          {
            title: 'Men and Women Equivalence',
            question: '3 men or 5 women can do a work in 12 days. How long will 6 men and 5 women take to finish the work?',
            solution: '3 Men = 5 Women => 6 Men = 10 Women. 6 Men + 5 Women = 10 Women + 5 Women = 15 Women. 5 women take 12 days => 15 women take (5 * 12) / 15 = 4 days.',
            explanation: 'Convert all workers into a single common gender denomination.',
            shortcut: 'Days = 12 / (6/3 + 5/5) = 12 / (2 + 1) = 12 / 3 = 4 days.',
            finalAnswer: '4 days'
          }
        ],
        practiceQuestions: [
          {
            id: 'pq_tw_1',
            question: 'A can do a work in 10 days and B in 15 days. If they work together for 3 days, what percentage of the work is completed?',
            options: ['50%', '60%', '40%', '30%'],
            correctAnswer: 0,
            difficulty: 'Beginner',
            previousExamRef: 'TCS NQT',
            explanation: 'Together they do (1/10 + 1/15) = 1/6 per day. In 3 days: 3 * (1/6) = 1/2 = 50%.'
          }
        ],
        testQuestions: [
          {
            id: 'tq_tw_1',
            question: 'A and B together can do a piece of work in 12 days, which B alone can do in 30 days. In how many days can A alone do the work?',
            options: ['20 days', '18 days', '25 days', '15 days'],
            correctAnswer: 0,
            explanation: '1/A = 1/12 - 1/30 = (5 - 2)/60 = 3/60 = 1/20 => 20 days.'
          }
        ]
      },
      {
        name: 'Time, Speed and Distance',
        slug: 'time-speed-and-distance',
        category: 'Quantitative Aptitude',
        icon: 'Navigation',
        badge: 'Core Subject',
        importance: 'High (Encompasses Trains, Boats & Streams, and Relative Speed)',
        examUsage: 'SSC CGL, Banking (SBI/IBPS), TCS, Cognizant, UPSC CSAT',
        difficulty: 'Intermediate',
        estimatedTime: '3.5 Hours',
        summary: 'Unit conversions, average speed over equal distances, and relative motion equations.',
        description: 'Covers physical motion, relative speeds, circular tracks, and head starts.',
        concepts: {
          basic: [
            { title: 'Basic Relationships & Unit Conversions', content: 'Speed = Distance / Time. To convert km/h to m/s: multiply by 5/18. To convert m/s to km/h: multiply by 18/5.' }
          ],
          intermediate: [
            { title: 'Average Speed for Equal Distances', content: 'Average Speed = (2 * S1 * S2) / (S1 + S2). Never take simple arithmetic average!' },
            { title: 'Relative Speed', content: 'Opposite directions: add speeds (S1 + S2). Same direction: subtract speeds (S1 - S2).' }
          ],
          advanced: [
            { title: 'Meeting Point and Time to Destination', content: 'If two people start from A & B towards each other and take t1 and t2 to reach their destinations after meeting: S1 / S2 = sqrt(t2 / t1).' }
          ],
          shortcuts: [
            { title: 'Harmonic Mean for Average Speed', trick: 'Avg Speed = 2xy / (x + y)', example: 'Travel to office at 60 km/h, return at 40 km/h: (2 * 60 * 40) / (60 + 40) = 4800 / 100 = 48 km/h.' }
          ],
          commonMistakes: [
            { mistake: 'Computing average speed as (60 + 40)/2 = 50 km/h.', correction: 'Since distance is equal, the correct formula is the harmonic mean: 48 km/h.' }
          ]
        },
        formulas: [
          {
            name: 'Unit Conversion Factor',
            expression: '1 km/h = 5/18 m/s',
            explanation: 'Standard speed converter.',
            variables: [{ symbol: '5/18', meaning: '1000m / 3600s' }],
            whenToUse: 'When train length is in meters and speed in km/h.',
            solvedExample: '72 km/h = 72 * (5/18) = 20 m/s.'
          },
          {
            name: 'Average Speed Formula',
            expression: 'Avg Speed = (2 * x * y) / (x + y)',
            explanation: 'Calculates average speed when equal distances are covered at speeds x and y.',
            variables: [{ symbol: 'x', meaning: 'Speed 1' }, { symbol: 'y', meaning: 'Speed 2' }],
            whenToUse: 'Round trip journeys over equal distance.',
            solvedExample: 'Go at 30 km/h, return at 20 km/h: (2*30*20)/50 = 24 km/h.'
          }
        ],
        solvedExamples: [
          {
            title: 'Average Speed Trap',
            question: 'A man drives to a city at 40 km/h and returns at 60 km/h. What is his average speed for the whole journey?',
            solution: 'Average Speed = 2xy / (x + y) = (2 * 40 * 60) / (40 + 60) = 4800 / 100 = 48 km/h.',
            explanation: 'Time taken is longer at slower speeds, weighting the lower speed more heavily.',
            shortcut: 'Direct formula: 48 km/h.',
            finalAnswer: '48 km/h'
          },
          {
            title: 'Late and Early Speed Adjustment',
            question: 'Walking at 3/4 of his usual speed, a man reaches his office 20 minutes late. Find his usual time to reach office.',
            solution: 'Speed becomes 3/4 of normal => Time becomes 4/3 of normal. Extra time = 4/3 T - T = 1/3 T = 20 minutes => T = 20 * 3 = 60 minutes (1 hour).',
            explanation: 'When distance is constant, time is inversely proportional to speed.',
            shortcut: 'Usual Time = [Numerator / (Denominator - Numerator)] * Delay = [3 / (4 - 3)] * 20 = 60 minutes.',
            finalAnswer: '60 minutes'
          },
          {
            title: 'Police and Thief Chase',
            question: 'A thief is spotted by a policeman from a distance of 200m. When the policeman starts chase, the thief also runs. If thief runs at 10 km/h and policeman at 11 km/h, how far will the thief have run before being overtaken?',
            solution: 'Relative speed = 11 - 10 = 1 km/h = 1 * (5/18) = 5/18 m/s. Initial distance = 200 m. Time to catch = 200 / (5/18) = (200 * 18) / 5 = 720 seconds = 0.2 hours. Distance run by thief = 10 km/h * 0.2 h = 2 km = 2,000 meters.',
            explanation: 'The policeman closes the 200m gap at the relative speed differential.',
            shortcut: 'Distance ratio = Speed ratio = 11 : 10. Gap of 1 unit = 200m. Thief (10 units) = 2,000m.',
            finalAnswer: '2,000 meters'
          },
          {
            title: 'Trains Passing in Opposite Directions',
            question: 'Two trains 140 m and 160 m long are running at speeds of 60 km/h and 40 km/h respectively in opposite directions on parallel tracks. Time taken to pass each other is:',
            solution: 'Total distance = 140 + 160 = 300 m. Relative speed = 60 + 40 = 100 km/h = 100 * (5/18) = 250/9 m/s. Time = 300 / (250/9) = (300 * 9) / 250 = 2700 / 250 = 10.8 seconds.',
            explanation: 'When moving in opposite directions, relative speed is the sum of both speeds.',
            shortcut: '300 / (100 * 5/18) = 10.8 s.',
            finalAnswer: '10.8 seconds'
          },
          {
            title: 'Meeting Post Departure Formula',
            question: 'Two trains start at the same time from Aligarh and Delhi and proceed towards each other at 16 km/h and 21 km/h respectively. When they meet, one train has travelled 60 km more than the other. Distance between the two stations is:',
            solution: 'Let time until meeting = t hours. Difference in distance = (21 - 16) * t = 5t = 60 km => t = 12 hours. Total distance = (21 + 16) * t = 37 * 12 = 444 km.',
            explanation: 'Since both travel for the exact same duration until collision/meeting, distance ratio equals speed ratio.',
            shortcut: 'Total Distance = (21 + 16) / (21 - 16) * 60 = (37 / 5) * 60 = 444 km.',
            finalAnswer: '444 km'
          }
        ],
        practiceQuestions: [
          {
            id: 'pq_tsd_1',
            question: 'A train 125 m long passes a telegraph pole in 5 seconds. What is the speed of the train in km/h?',
            options: ['90 km/h', '75 km/h', '80 km/h', '60 km/h'],
            correctAnswer: 0,
            difficulty: 'Beginner',
            previousExamRef: 'RRB NTPC',
            explanation: 'Speed = 125 / 5 = 25 m/s. In km/h = 25 * (18/5) = 90 km/h.'
          }
        ],
        testQuestions: [
          {
            id: 'tq_tsd_1',
            question: 'If a person walks at 14 km/h instead of 10 km/h, he would have walked 20 km more. The actual distance travelled by him is:',
            options: ['50 km', '56 km', '70 km', '80 km'],
            correctAnswer: 0,
            explanation: 'Time is constant: D / 10 = (D + 20) / 14 => 14D = 10D + 200 => 4D = 200 => D = 50 km.'
          }
        ]
      },
      // Additional Core Topics in Logical Reasoning
      {
        name: 'Syllogism',
        slug: 'syllogism',
        category: 'Logical Reasoning',
        icon: 'Cpu',
        badge: 'High Accuracy',
        importance: 'Critical (5 marks guaranteed in Banking Prelims and Mains)',
        examUsage: 'SBI PO, IBPS PO, RRB PO, SSC CGL, Campus recruitment',
        difficulty: 'Intermediate',
        estimatedTime: '2.5 Hours',
        summary: 'Venn diagrams and "Only a few" deductions for definitive conclusions.',
        description: 'Syllogism tests deductive logic using statements and conclusions involving All, Some, No, and modern cases like Only a few.',
        concepts: {
          basic: [
            { title: 'Standard Quantifiers', content: 'All A are B (universal affirmative), Some A are B (particular affirmative), No A is B (universal negative), Some A are not B (particular negative).' }
          ],
          intermediate: [
            { title: 'Modern Case: "Only a few A are B"', content: '"Only a few A are B" implies TWO things simultaneously: 1. Some A are B, AND 2. Some A are definitely NOT B.' },
            { title: 'Complementary Pairs (Either/Or)', content: 'Three conditions for Either/Or: 1. Both conclusions individually false, 2. Same subject and predicate, 3. One is Some and other is No (or Some and Some Not).' }
          ],
          advanced: [
            { title: 'Possibility Conclusions', content: 'A possibility conclusion is true if there exists at least one valid Venn configuration where it holds without violating given statements.' }
          ],
          shortcuts: [
            { title: 'Definite Negative Check', trick: 'If all statements are positive, no definite negative conclusion can follow.', example: 'Statements: All pens are books, Some books are cups. Conclusion: No pen is cup (Instantly False without drawing!).' }
          ],
          commonMistakes: [
            { mistake: 'Treating "Some A are B" as meaning "Some A are NOT B".', correction: 'In formal logic, "Some A are B" guarantees at least one A is B; it does not disprove that All A could be B.' }
          ]
        },
        formulas: [
          {
            name: 'Either/Or Triad Rule',
            expression: 'Subject & Predicate match + Both false individually + Complementary pair (Some + No)',
            explanation: 'Establishes valid disjunction.',
            variables: [{ symbol: 'Pair', meaning: 'Some + No or All + Some Not' }],
            whenToUse: 'When evaluating options with Either I or II follows.',
            solvedExample: 'Conclusions: 1. Some cats are dogs (False), 2. No cat is dog (False). Result: Either I or II follows.'
          }
        ],
        solvedExamples: [
          {
            title: 'Modern "Only a few" Case',
            question: 'Statements: Only a few books are pens. All pens are markers. Conclusions: I. Some books can never be markers. II. Some markers are books.',
            solution: 'Only a few books are pens means: Some books are pens AND Some books are NOT pens. Pens are entirely inside markers. Conclusion I: We know some books are not pens, but could all books be markers? Yes! So I is false. Conclusion II: Since some books are pens and all pens are markers, those books must be markers. Hence II is definitely true.',
            explanation: 'Conclusion II follows directly from intersection of sets.',
            shortcut: 'Only conclusion II follows.',
            finalAnswer: 'Only conclusion II follows'
          },
          {
            title: 'Possibility Verification',
            question: 'Statements: Some apples are mangoes. No mango is banana. Conclusions: I. All apples being bananas is a possibility. II. Some apples are not bananas.',
            solution: 'The part of apples that are mangoes can NEVER be bananas (since No mango is banana). Therefore, All apples can never be bananas (I is false). And that same part guarantees that Some apples are not bananas (II is definitely true).',
            explanation: 'Apples that overlap with mangoes are banned from bananas.',
            shortcut: 'Conclusion II follows.',
            finalAnswer: 'Only conclusion II follows'
          },
          {
            title: 'Complementary Either/Or Pair',
            question: 'Statements: Some tables are chairs. Some chairs are desks. Conclusions: I. Some tables are desks. II. No table is desk.',
            solution: 'No direct relation between tables and desks is given. Hence, neither Conclusion I nor Conclusion II is definitely true. However, since the subject (tables) and predicate (desks) are identical and they form a Some + No pair, one of them must always be true in any possible world.',
            explanation: 'Standard Either/Or complementary pair conditions are satisfied.',
            shortcut: 'Either I or II follows.',
            finalAnswer: 'Either I or II follows'
          },
          {
            title: 'All Inclusions Chain',
            question: 'Statements: All cars are buses. All buses are trains. All trains are planes. Conclusions: I. All cars are planes. II. Some planes are buses.',
            solution: 'Cars are a subset of buses, which are subset of trains, which are subset of planes. Therefore, Cars are completely inside planes (I follows). And the plane set covers the entire bus set, so Some planes are buses (II follows).',
            explanation: 'Concentric circle hierarchy: both conclusions follow.',
            shortcut: 'Both I and II follow.',
            finalAnswer: 'Both I and II follow'
          },
          {
            title: 'Strict Negative Boundary',
            question: 'Statements: No red is blue. All blue are green. Conclusions: I. Some green are not red. II. All green being red is a possibility.',
            solution: 'All blue are inside green, and no blue can ever be red. Hence, the blue portion of green can NEVER be red, which proves "Some green are not red" is True. Consequently, All green cannot be red (II is False).',
            explanation: 'The blue core inside green rejects any red overlap.',
            shortcut: 'Only I follows.',
            finalAnswer: 'Only I follows'
          }
        ],
        practiceQuestions: [
          {
            id: 'pq_syl_1',
            question: 'Statements: All flowers are trees. No tree is fruit. Conclusion: No flower is fruit.',
            options: ['Only conclusion follows', 'Conclusion does not follow', 'Either follows', 'Both follow'],
            correctAnswer: 0,
            difficulty: 'Beginner',
            previousExamRef: 'IBPS PO Prelims',
            explanation: 'Flowers are inside trees, and trees have zero overlap with fruit. Hence flowers cannot overlap with fruit.'
          }
        ],
        testQuestions: [
          {
            id: 'tq_syl_1',
            question: 'Statements: Some A are B. All B are C. Conclusions: I. Some A are C. II. All C are A.',
            options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
            correctAnswer: 0,
            explanation: 'Since Some A are B and all B are C, the intersection of A and B is also part of C. Only I follows.'
          }
        ]
      },
      // Additional Verbal Ability Topic
      {
        name: 'Reading Comprehension',
        slug: 'reading-comprehension',
        category: 'Verbal Ability',
        icon: 'BookOpen',
        badge: 'Top Weightage',
        importance: 'High (8-10 marks in Banking Prelims and 12-15 in Mains)',
        examUsage: 'Banking PO/Clerk, CAT, UPSC CSAT, SSC CGL Tier 2, Placement verbal rounds',
        difficulty: 'Advanced',
        estimatedTime: '4.0 Hours',
        summary: 'Skimming strategies, central theme identification, tone analysis, and vocabulary in context.',
        description: 'Assesses candidate capability to digest complex prose, recognize implicit inferences, determine author perspective, and extract factual answers.',
        concepts: {
          basic: [
            { title: 'Active Reading vs Passive Reading', content: 'Engage with paragraph topic sentences. Summarize the core idea of each paragraph in 3-4 mental words.' }
          ],
          intermediate: [
            { title: 'Question-First Strategy', content: 'Skim question stems first to identify keywords (proper nouns, years, technical terms) before diving deep into passage.' },
            { title: 'Decoding Author Tone', content: 'Identify whether the tone is Objective/Analytical, Critical/Cynical, Eulogistic/Laudatory, or Sarcastic.' }
          ],
          advanced: [
            { title: 'Handling Inference Questions', content: 'An inference is what must be logically true based on the passage, not an assumption or far-fetched extrapolation.' }
          ],
          shortcuts: [
            { title: 'Extreme Words Elimination', trick: 'Options with "Always", "Never", "Only", "Completely" are wrong 90% of the time in RC.', example: 'Choose moderate phrases like "often", "may lead to", "suggests" over absolute claims.' }
          ],
          commonMistakes: [
            { mistake: 'Bringing outside factual knowledge that is not supported by the passage text.', correction: 'Strictly answer based ONLY on the author’s explicit text and direct logical inferences.' }
          ]
        },
        formulas: [
          {
            name: 'Passage Scanning Formula',
            expression: 'Central Theme = Topic Sentence (Para 1) + Concluding Sentence (Final Para)',
            explanation: 'Fast-tracks locating the main idea.',
            variables: [{ symbol: 'Theme', meaning: 'Author primary purpose' }],
            whenToUse: 'When answering "What is the primary purpose of the passage?".',
            solvedExample: 'Read opening lines of first and last paragraph to identify thesis.'
          }
        ],
        solvedExamples: [
          {
            title: 'Central Idea Extraction',
            question: 'Passage excerpt: "Artificial intelligence in clinical diagnosis does not aim to replace clinicians; rather, it augments human judgment by sifting through massive radiological scans with consistent statistical vigilance." What is the main point?',
            solution: 'The central point is that AI serves as a collaborative diagnostic aid for healthcare professionals rather than their outright replacement.',
            explanation: 'The sentence directly contrasts "replace" with "augments human judgment".',
            shortcut: 'Look for qualifying conjunctions like "rather" and "not X but Y".',
            finalAnswer: 'AI is designed to augment and assist clinicians, not replace them.'
          },
          {
            title: 'Inference Discrimination',
            question: 'Passage excerpt: "Renewable energy adoption surged by 34% last year, yet global grid stability challenges grew due to inadequate storage deployment." What can be inferred?',
            solution: 'Grid stability requires matching energy storage capacity alongside generation increases.',
            explanation: 'The "yet" indicates that growth in generation alone does not solve grid reliability without corresponding storage.',
            shortcut: 'Identify the contrast hinge to pinpoint the underlying prerequisite.',
            finalAnswer: 'Energy storage is critical for the stability of renewable-heavy power grids.'
          },
          {
            title: 'Tone Identification',
            question: 'Passage excerpt: "While proponents champion quantum computing as an imminent panacea, sober examination reveals decades of unsolved error-mitigation hurdles ahead." What is the author’s tone?',
            solution: 'Pragmatic / Realistic / Skeptical of hyperbolic claims.',
            explanation: 'Words like "sober examination" and "unsolved hurdles" counter the uncritical optimism.',
            shortcut: 'Contrast between "panacea" and "sober examination" reveals analytical skepticism.',
            finalAnswer: 'Pragmatic and cautiously analytical.'
          },
          {
            title: 'Vocabulary in Context',
            question: 'Passage sentence: "The minister’s remarks served only to precipitate a fresh round of union strikes." What does "precipitate" mean here?',
            solution: 'To cause an undesirable event to happen suddenly or prematurely.',
            explanation: 'In context with "fresh round of strikes", precipitate means trigger or accelerate.',
            shortcut: 'Replace with synonyms: "trigger / spark / provoke".',
            finalAnswer: 'To trigger or cause suddenly.'
          },
          {
            title: 'Author’s Implicit Assumption',
            question: 'Passage excerpt: "Unless urban municipalities charge congestion pricing during rush hours, commuter delays will continue to drag city GDP." What assumption is made?',
            solution: 'Higher congestion pricing will discourage enough vehicular trips during peak hours to ease commuter traffic.',
            explanation: 'For congestion pricing to cure delays, pricing must function as an effective behavioral deterrent.',
            shortcut: 'The solution presupposes price elasticity among peak-hour drivers.',
            finalAnswer: 'Commuters will alter travel timing or modes in response to price signals.'
          }
        ],
        practiceQuestions: [
          {
            id: 'pq_rc_1',
            question: 'Which of the following best describes an option that uses words like "invariably", "solely", and "without exception"?',
            options: ['Likely to be too extreme', 'Always the correct answer', 'Reflects scientific rigor', 'Recommended by examiners'],
            correctAnswer: 0,
            difficulty: 'Intermediate',
            previousExamRef: 'CAT & SBI PO Mains',
            explanation: 'Extreme words typically misrepresent measured author arguments.'
          }
        ],
        testQuestions: [
          {
            id: 'tq_rc_1',
            question: 'When asked for the primary purpose of a passage, what should you identify first?',
            options: ['The author’s overarching message and communicative intent', 'Minor examples listed in paragraph 3', 'A specific statistic mentioned in passing', 'The dictionary definition of obscure terms'],
            correctAnswer: 0,
            explanation: 'Primary purpose refers to why the author wrote the article.'
          }
        ]
      },
      // Additional Data Interpretation Topic
      {
        name: 'Table DI',
        slug: 'table-di',
        category: 'Data Interpretation',
        icon: 'Table',
        badge: 'Calculative',
        importance: 'High (Standard DI format across all Banking & SSC tests)',
        examUsage: 'SBI PO, IBPS PO, RRB PO, SSC CGL, Campus placement drives',
        difficulty: 'Intermediate',
        estimatedTime: '3.0 Hours',
        summary: 'Tabular data interpretation, rapid percentage additions, ratios, and cross-column comparisons.',
        description: 'Tests your speed in extracting figures from structured data grids and computing sums, differences, and growth rates without manual errors.',
        concepts: {
          basic: [
            { title: 'Reading Data Tables Efficiently', content: 'Always read row labels, column headers, units (in thousands, crores, percentages), and footnote remarks before touching questions.' }
          ],
          intermediate: [
            { title: 'Approximation Techniques', content: 'Round values to 2 significant digits when answer options are separated by more than 3%.' }
          ],
          advanced: [
            { title: 'Weighted Average from Tabular Percentages', content: 'Overall % = (Sum of Values * Individual %) / Total Sum.' }
          ],
          shortcuts: [
            { title: 'Digit Sum and Unit Value Elimination', trick: 'Check last digit or approximate ranges to avoid computing full 5-digit multiplications.', example: '5824 / 192 -> 5800 / 200 = 29 approx.' }
          ],
          commonMistakes: [
            { mistake: 'Misreading units (e.g. interpreting figures in lakhs as thousands).', correction: 'Underline the table header unit tag first!' }
          ]
        },
        formulas: [
          {
            name: 'Percentage Growth in Tables',
            expression: 'Growth % = [(Value in Year 2 - Value in Year 1) / Value in Year 1] * 100',
            explanation: 'Computes year-on-year tabular expansion.',
            variables: [{ symbol: 'Year 1', meaning: 'Base period' }, { symbol: 'Year 2', meaning: 'Target period' }],
            whenToUse: 'Comparing sales, revenues, or populations across table rows.',
            solvedExample: '2020: 400 Cr, 2021: 520 Cr. Growth = (120/400)*100 = 30%.'
          }
        ],
        solvedExamples: [
          {
            title: 'Five College Enrollment Table',
            question: 'A table shows students in 5 colleges: A(450), B(600), C(750), D(300), E(900). What is the average number of students per college?',
            solution: 'Total = 450 + 600 + 750 + 300 + 900 = 3,000. Average = 3000 / 5 = 600 students.',
            explanation: 'Sum up all entries and divide by number of entities.',
            shortcut: 'Use baseline 600: -150 + 0 + 150 - 300 + 300 = 0 => Exactly 600.',
            finalAnswer: '600 students'
          },
          {
            title: 'Percentage Share Computation',
            question: 'From the same table, students in College C (750) represent what percentage of total students (3000)?',
            solution: 'Percentage = (750 / 3000) * 100 = 25%.',
            explanation: 'Divide the specific row by aggregate sum.',
            shortcut: '750/3000 = 1/4 = 25%.',
            finalAnswer: '25%'
          },
          {
            title: 'Ratio Comparison',
            question: 'What is the ratio of students in College B and D combined to students in College E?',
            solution: 'College B + D = 600 + 300 = 900. College E = 900. Ratio = 900 : 900 = 1 : 1.',
            explanation: 'Combine specified terms and reduce to lowest integer ratio.',
            shortcut: '1 : 1.',
            finalAnswer: '1 : 1'
          },
          {
            title: 'Highest Growth Identification',
            question: 'Sales grew: Product P (100 to 140), Product Q (200 to 260). Which product showed higher percentage growth?',
            solution: 'Growth P = (40 / 100) * 100 = 40%. Growth Q = (60 / 200) * 100 = 30%. Product P showed higher growth.',
            explanation: 'Higher absolute increase (60 vs 40) does not imply higher percentage growth (30% vs 40%).',
            shortcut: 'P = 40%, Q = 30%. Product P is higher.',
            finalAnswer: 'Product P (40%)'
          },
          {
            title: 'Weighted Pass Percentage',
            question: 'Class X (60 students, 80% pass) and Class Y (40 students, 70% pass). What is overall pass percentage?',
            solution: 'Passed in X = 60 * 0.80 = 48. Passed in Y = 40 * 0.70 = 28. Total passed = 76. Total students = 100. Overall pass % = 76%.',
            explanation: 'Calculate actual successful numbers before finding collective percentage.',
            shortcut: '(48 + 28)/100 = 76%.',
            finalAnswer: '76%'
          }
        ],
        practiceQuestions: [
          {
            id: 'pq_tab_1',
            question: 'If data indicates sales of Rs. 150 Cr in 2021 and Rs. 195 Cr in 2022, what is the annual growth percentage?',
            options: ['30%', '25%', '35%', '20%'],
            correctAnswer: 0,
            difficulty: 'Beginner',
            previousExamRef: 'IBPS Clerk Prelims',
            explanation: '(45 / 150) * 100 = 30%.'
          }
        ],
        testQuestions: [
          {
            id: 'tq_tab_1',
            question: 'In a company of 800 employees, 35% are in Sales, 25% in IT, and the remaining in Operations. How many are in Operations?',
            options: ['320', '280', '300', '240'],
            correctAnswer: 0,
            explanation: 'Operations % = 100% - (35% + 25%) = 40%. 40% of 800 = 320 employees.'
          }
        ]
      },
      // Additional Computer Aptitude Topic
      {
        name: 'Operating Systems',
        slug: 'operating-systems',
        category: 'Computer Aptitude',
        icon: 'Server',
        badge: 'Fundamental',
        importance: 'Medium (Tested in RBI Assistant, IBPS RRB, and Campus IT rounds)',
        examUsage: 'IBPS RRB Officer, RBI Assistant, TCS Technical Aptitude, Infosys',
        difficulty: 'Intermediate',
        estimatedTime: '2.5 Hours',
        summary: 'Processes, memory management, file systems, page faults, and deadlocks.',
        description: 'Covers core OS architecture: kernel space, CPU scheduling algorithms, virtual memory, paging, and concurrency control.',
        concepts: {
          basic: [
            { title: 'Kernel and Shell', content: 'The kernel is the core program that manages CPU, memory, and devices. The shell provides the user interface (CLI or GUI) to interact with the kernel.' }
          ],
          intermediate: [
            { title: 'Process vs Thread', content: 'A process is an executing program with its own address space. A thread is a lightweight execution unit inside a process that shares memory with sibling threads.' },
            { title: 'CPU Scheduling Algorithms', content: 'FCFS (First Come First Served), SJF (Shortest Job First), Round Robin (time quantum), and Priority Scheduling.' }
          ],
          advanced: [
            { title: 'The Four Conditions of Deadlock', content: '1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, 4. Circular Wait (Coffman conditions).' }
          ],
          shortcuts: [
            { title: 'Deadlock Prevention Acronym', trick: 'M-H-N-C (Mutual exclusion, Hold & wait, No preemption, Circular wait)', example: 'Breaking any ONE of these four conditions guarantees deadlock cannot occur.' }
          ],
          commonMistakes: [
            { mistake: 'Confusing paging with segmentation.', correction: 'Paging divides memory into fixed-size physical frames; segmentation divides code into variable-size logical modules.' }
          ]
        },
        formulas: [
          {
            name: 'Turnaround Time Formula',
            expression: 'Turnaround Time = Completion Time - Arrival Time',
            explanation: 'Calculates total time a job spends in the operating system.',
            variables: [{ symbol: 'Completion', meaning: 'Time job finishes' }, { symbol: 'Arrival', meaning: 'Time job entered ready queue' }],
            whenToUse: 'OS scheduling performance metrics.',
            solvedExample: 'Job arrives at t=2, finishes at t=10 => TAT = 8ms.'
          }
        ],
        solvedExamples: [
          {
            title: 'Round Robin Turnaround',
            question: 'In a time-sharing system with quantum of 2ms, process P1 needs 5ms. How many context switches occur before P1 completes?',
            solution: 'Quantum allocation: 0-2ms (switch 1), 2ms-4ms (switch 2), 4ms-5ms (finishes). Two context switches away from P1 occur.',
            explanation: 'Each time slice expiration triggers a context switch to next ready process.',
            shortcut: 'Ceil(5/2) - 1 = 3 - 1 = 2 context switches.',
            finalAnswer: '2 context switches'
          },
          {
            title: 'Virtual Memory Page Fault',
            question: 'What happens when a CPU reference tries to access a page that is not currently loaded in physical RAM?',
            solution: 'A page fault interrupt is generated by the MMU, causing the OS to trap into kernel mode, retrieve the page from swap disk, and update the page table.',
            explanation: 'Page fault handling is the foundation of demand paging in modern OSs.',
            shortcut: 'Page fault triggers disk fetch into free frame.',
            finalAnswer: 'Page Fault interrupt occurs'
          },
          {
            title: 'Deadlock Handling',
            question: 'Which famous algorithm is used to avoid deadlocks by verifying safe states before resource allocation?',
            solution: 'Banker’s Algorithm (formulated by Edsger Dijkstra).',
            explanation: 'It simulates allocation to verify that at least one sequence can satisfy all processes without running out of resources.',
            shortcut: 'Banker’s Algorithm.',
            finalAnswer: 'Banker’s Algorithm'
          },
          {
            title: 'Thrashing Identification',
            question: 'A computer system spends significantly more time swapping pages in and out of secondary memory than executing instructions. This phenomenon is called:',
            solution: 'Thrashing.',
            explanation: 'Thrashing occurs when the collective working sets of active processes exceed available physical memory.',
            shortcut: 'Thrashing.',
            finalAnswer: 'Thrashing'
          },
          {
            title: 'Spooling Concept',
            question: 'What does SPOOLING stand for in operating systems?',
            solution: 'Simultaneous Peripheral Operations On-Line.',
            explanation: 'Data is held in a temporary buffer/disk queue until the slow peripheral device (like a printer) is ready to process it.',
            shortcut: 'Simultaneous Peripheral Operations On-Line.',
            finalAnswer: 'Simultaneous Peripheral Operations On-Line'
          }
        ],
        practiceQuestions: [
          {
            id: 'pq_os_1',
            question: 'Which of the following is NOT a necessary condition for a deadlock to occur?',
            options: ['Preemption', 'Mutual Exclusion', 'Hold and Wait', 'Circular Wait'],
            correctAnswer: 0,
            difficulty: 'Intermediate',
            previousExamRef: 'RBI Assistant & IT Officer',
            explanation: 'Preemption breaks deadlock. The necessary condition is "NO Preemption".'
          }
        ],
        testQuestions: [
          {
            id: 'tq_os_1',
            question: 'Which component of the OS is responsible for selecting which process should run next on the CPU?',
            options: ['Short-term scheduler (CPU scheduler)', 'Long-term scheduler', 'Medium-term scheduler', 'Spooler'],
            correctAnswer: 0,
            explanation: 'The short-term scheduler (dispatcher) selects from the ready queue in millisecond frequencies.'
          }
        ]
      }
    ];

    // Also populate all the remaining topics required by the specification so that every single category is fully represented
    const extraTopics = [
      // Quant
      { name: 'Number System', slug: 'number-system', category: 'Quantitative Aptitude', icon: 'Hash', summary: 'Divisibility rules, unit digits, remainders theorem, and prime factorization.' },
      { name: 'Simplification', slug: 'simplification', category: 'Quantitative Aptitude', icon: 'Divide', summary: 'BODMAS priority, surds, indices, fractions, and rapid mental arithmetic.' },
      { name: 'Approximation', slug: 'approximation', category: 'Quantitative Aptitude', icon: 'Maximize2', summary: 'Rounding techniques and rapid estimation for banking prelims speed rounds.' },
      { name: 'HCF and LCM', slug: 'hcf-and-lcm', category: 'Quantitative Aptitude', icon: 'Layers', summary: 'Product of two numbers = HCF * LCM, bells ringing together, and modular remainders.' },
      { name: 'Ratio and Proportion', slug: 'ratio-and-proportion', category: 'Quantitative Aptitude', icon: 'GitCommit', summary: 'Direct, inverse, and compound proportions with duplicate and triplicate ratios.' },
      { name: 'Partnership', slug: 'partnership', category: 'Quantitative Aptitude', icon: 'Users', summary: 'Investment * Time capital weighting, sleeping partner allocations, and profit sharing.' },
      { name: 'Average', slug: 'average', category: 'Quantitative Aptitude', icon: 'Activity', summary: 'Deviations from assumed mean, replacement rules, and batting/bowling averages.' },
      { name: 'Mixtures and Allegations', slug: 'mixtures-and-allegations', category: 'Quantitative Aptitude', icon: 'FlaskConical', summary: 'Cross-allegation rule, replacement of liquids, and repeated dilution formulas.' },
      { name: 'Problems on Ages', slug: 'problems-on-ages', category: 'Quantitative Aptitude', icon: 'UserCheck', summary: 'Age ratio shifts before N years and after M years solved by linear systems.' },
      { name: 'Pipes and Cisterns', slug: 'pipes-and-cisterns', category: 'Quantitative Aptitude', icon: 'Droplets', summary: 'Inlet positive efficiency, leak negative efficiency, and alternating pipe schedules.' },
      { name: 'Problems on Trains', slug: 'problems-on-trains', category: 'Quantitative Aptitude', icon: 'Train', summary: 'Passing pole/platform, opposite and same direction relative speeds, and train lengths.' },
      { name: 'Boats and Streams', slug: 'boats-and-streams', category: 'Quantitative Aptitude', icon: 'Anchor', summary: 'Downstream speed = u + v, Upstream speed = u - v, and still water boat speeds.' },
      { name: 'Permutation and Combination', slug: 'permutation-and-combination', category: 'Quantitative Aptitude', icon: 'Grid', summary: 'Fundamental counting principle, arrangements, circle seating, and selection sets.' },
      { name: 'Probability', slug: 'probability', category: 'Quantitative Aptitude', icon: 'Dices', summary: 'Favorable outcomes over sample space, dice, cards, balls, and mutually exclusive events.' },
      { name: 'Mensuration', slug: 'mensuration', category: 'Quantitative Aptitude', icon: 'Box', summary: '2D perimeter & areas, 3D surface area & volumes of cylinders, cones, and spheres.' },
      { name: 'Geometry', slug: 'geometry', category: 'Quantitative Aptitude', icon: 'Triangle', summary: 'Triangles, circles, chords, tangents, similarity, and cyclic quadrilaterals.' },
      { name: 'Algebra', slug: 'algebra', category: 'Quantitative Aptitude', icon: 'Variable', summary: 'Quadratic equations, factorization, roots, identity expansions, and inequalities.' },
      { name: 'Data Interpretation', slug: 'data-interpretation', category: 'Quantitative Aptitude', icon: 'PieChart', summary: 'Mastering cross-graph data synthesis and fast percentile calculations.' },
      { name: 'Data Sufficiency', slug: 'data-sufficiency', category: 'Quantitative Aptitude', icon: 'CheckSquare', summary: 'Evaluating whether statements individually or collectively suffice to answer.' },

      // Logical Reasoning
      { name: 'Number Series', slug: 'number-series', category: 'Logical Reasoning', icon: 'ListOrdered', summary: 'Pattern recognition: difference of differences, alternating series, and prime gaps.' },
      { name: 'Alphabet Series', slug: 'alphabet-series', category: 'Logical Reasoning', icon: 'Type', summary: 'Letter positional values (EJOTY), reverse ranks, and skip-pattern sequences.' },
      { name: 'Coding and Decoding', slug: 'coding-and-decoding', category: 'Logical Reasoning', icon: 'FileCode', summary: 'Letter shifting, substitution cyphers, Chinese coding, and binary symbols.' },
      { name: 'Blood Relations', slug: 'blood-relations', category: 'Logical Reasoning', icon: 'HeartHandshake', summary: 'Family tree diagrams, generation charts, and coded relation symbols.' },
      { name: 'Direction Sense', slug: 'direction-sense', category: 'Logical Reasoning', icon: 'Compass', summary: 'Cardinal directions, Pythagoras displacements, shadow positions, and turns.' },
      { name: 'Seating Arrangement', slug: 'seating-arrangement', category: 'Logical Reasoning', icon: 'Users', summary: 'Linear rows, circular inward/outward tables, and concentric arrangement challenges.' },
      { name: 'Puzzles', slug: 'puzzles', category: 'Logical Reasoning', icon: 'Puzzle', summary: 'Floor puzzles, box stacks, scheduling days, and multi-variable matrices.' },
      { name: 'Inequality', slug: 'inequality', category: 'Logical Reasoning', icon: 'EqualNot', summary: 'Statement statements with greater than, less than, or equal symbols and either/or.' },
      { name: 'Statement and Conclusion', slug: 'statement-and-conclusion', category: 'Logical Reasoning', icon: 'CheckCircle', summary: 'Critical deductive reasoning deriving conclusions directly supported by premises.' },
      { name: 'Statement and Assumption', slug: 'statement-and-assumption', category: 'Logical Reasoning', icon: 'HelpCircle', summary: 'Identifying the unstated implicit beliefs underpinning a statement.' },
      { name: 'Cause and Effect', slug: 'cause-and-effect', category: 'Logical Reasoning', icon: 'GitMerge', summary: 'Determining whether statements act as independent causes or common effects.' },
      { name: 'Analogy', slug: 'analogy', category: 'Logical Reasoning', icon: 'GitCompare', summary: 'Establishing relational parallels between word, number, and symbolic pairs.' },
      { name: 'Classification', slug: 'classification', category: 'Logical Reasoning', icon: 'Filter', summary: 'Grouping items by shared semantic or arithmetic properties.' },
      { name: 'Odd One Out', slug: 'odd-one-out', category: 'Logical Reasoning', icon: 'AlertCircle', summary: 'Detecting the single anomaly that violates a group pattern.' },
      { name: 'Ranking and Ordering', slug: 'ranking-and-ordering', category: 'Logical Reasoning', icon: 'List', summary: 'Formula: Total = (Rank from Left + Rank from Right) - 1.' },
      { name: 'Calendar', slug: 'calendar', category: 'Logical Reasoning', icon: 'Calendar', summary: 'Odd days calculation, leap year rules, century codes, and day-of-week lookup.' },
      { name: 'Clock', slug: 'clock', category: 'Logical Reasoning', icon: 'Clock', summary: 'Angle between hands = |30H - (11/2)M|, coincidence, and right-angle intervals.' },
      { name: 'Input and Output', slug: 'input-and-output', category: 'Logical Reasoning', icon: 'Terminal', summary: 'Machine rearrangement algorithms sorting words and numbers systematically.' },

      // Verbal Ability
      { name: 'Error Spotting', slug: 'error-spotting', category: 'Verbal Ability', icon: 'AlertTriangle', summary: 'Subject-verb agreement, modifier placement, tense consistency, and prepositions.' },
      { name: 'Sentence Correction', slug: 'sentence-correction', category: 'Verbal Ability', icon: 'Edit3', summary: 'Grammatically sound and semantically concise sentence refactoring.' },
      { name: 'Fill in the Blanks', slug: 'fill-in-the-blanks', category: 'Verbal Ability', icon: 'PenTool', summary: 'Single and double fillers tested on vocabulary nuances and prepositions.' },
      { name: 'Synonyms and Antonyms', slug: 'synonyms-and-antonyms', category: 'Verbal Ability', icon: 'Repeat', summary: 'High-frequency competitive exam word roots, connotations, and usages.' },
      { name: 'One Word Substitution', slug: 'one-word-substitution', category: 'Verbal Ability', icon: 'Bookmark', summary: 'Concise vocabulary representing complex phrases, sciences, and personas.' },
      { name: 'Idioms and Phrases', slug: 'idioms-and-phrases', category: 'Verbal Ability', icon: 'Quote', summary: 'Figurative expressions, origin contexts, and standard competitive tests.' },
      { name: 'Para Jumbles', slug: 'para-jumbles', category: 'Verbal Ability', icon: 'Shuffle', summary: 'Pronoun linkages, chronological sequences, and opening sentence identifiers.' },
      { name: 'Cloze Test', slug: 'cloze-test', category: 'Verbal Ability', icon: 'FileText', summary: 'Passage blanks requiring harmonious tone, syntax, and thematic vocabulary.' },
      { name: 'Active and Passive Voice', slug: 'active-and-passive-voice', category: 'Verbal Ability', icon: 'Volume2', summary: 'Systematic transformation rules across tenses and modal verbs.' },
      { name: 'Direct and Indirect Speech', slug: 'direct-and-indirect-speech', category: 'Verbal Ability', icon: 'MessageSquare', summary: 'Narration changes, reporting verb tenses, and pronoun shifts.' },

      // Data Interpretation
      { name: 'Bar Graph', slug: 'bar-graph', category: 'Data Interpretation', icon: 'BarChart', summary: 'Vertical, horizontal, stacked, and clustered bars across multi-year data.' },
      { name: 'Line Graph', slug: 'line-graph', category: 'Data Interpretation', icon: 'TrendingUp', summary: 'Continuous time-series trend analysis, slopes, and percentage variations.' },
      { name: 'Pie Chart', slug: 'pie-chart', category: 'Data Interpretation', icon: 'PieChart', summary: 'Degree conversions (360 degrees = 100%), sector shares, and multi-pie charts.' },
      { name: 'Caselet DI', slug: 'caselet-di', category: 'Data Interpretation', icon: 'FileText', summary: 'Translating dense paragraph descriptions into structured Venn or tabular data.' },
      { name: 'Missing DI', slug: 'missing-di', category: 'Data Interpretation', icon: 'HelpCircle', summary: 'Deducing omitted values using contextual equations before solving questions.' },
      { name: 'Mixed Graph DI', slug: 'mixed-graph-di', category: 'Data Interpretation', icon: 'Layers', summary: 'Synthesizing data spanning a Bar Graph paired with a Pie Chart or Table.' },

      // Computer Aptitude
      { name: 'Computer Fundamentals', slug: 'computer-fundamentals', category: 'Computer Aptitude', icon: 'Monitor', summary: 'Von Neumann architecture, generations of computers, and binary representations.' },
      { name: 'Networking Basics', slug: 'networking-basics', category: 'Computer Aptitude', icon: 'Wifi', summary: 'OSI 7-layer model, TCP/IP, IP addressing, routers, switches, and protocols.' },
      { name: 'Database Fundamentals', slug: 'database-fundamentals', category: 'Computer Aptitude', icon: 'Database', summary: 'RDBMS, SQL keys, normalization (1NF, 2NF, 3NF), and ACID properties.' },
      { name: 'Cybersecurity Basics', slug: 'cybersecurity-basics', category: 'Computer Aptitude', icon: 'Shield', summary: 'Encryption, symmetric/asymmetric keys, malware, phishing, and firewalls.' },
      { name: 'MS Office', slug: 'ms-office', category: 'Computer Aptitude', icon: 'FileSpreadsheet', summary: 'Keyboard shortcuts, Excel formulas (VLOOKUP, SUMIF), and PowerPoint tools.' }
    ];

    // Helper to generate default rich content for extra topics so no page is ever empty!
    for (const item of extraTopics) {
      topicsData.push({
        name: item.name,
        slug: item.slug,
        category: item.category,
        icon: item.icon,
        badge: 'Recommended',
        importance: 'High',
        examUsage: `Frequently tested in Banking, SSC, CAT, & Campus Placements`,
        difficulty: 'Intermediate',
        estimatedTime: '2.5 Hours',
        summary: item.summary,
        description: `${item.name} is an indispensable component of ${item.category}. Mastering its foundational axioms and shortcuts provides an immense speed advantage in competitive aptitude examinations.`,
        concepts: {
          basic: [
            { title: `Core Principles of ${item.name}`, content: `Understanding fundamental terminology, standardized notations, and basic principles that govern ${item.name}.` },
            { title: 'Standard Definitions & Rules', content: `Essential operational steps and algebraic or logical axioms required to tackle initial difficulty questions.` }
          ],
          intermediate: [
            { title: 'Pattern Recognition & Application', content: `How questions are framed in modern examinations and strategies to decompose multi-step problems.` }
          ],
          advanced: [
            { title: 'Complex Edge Cases', content: `Handling multi-variable constraints, extreme boundaries, and ambiguous scenarios with rigorous accuracy.` }
          ],
          shortcuts: [
            { title: 'Elimination by Options', trick: 'Backsolve from options or check parity/last digits to eliminate 2 out of 4 options immediately.', example: 'Check options divisible by 3 or 7 before full calculation.' }
          ],
          commonMistakes: [
            { mistake: 'Rushing through question constraints such as "except", "not", or unit mismatches.', correction: 'Highlight the exact requested quantity before marking final answers.' }
          ]
        },
        formulas: [
          {
            name: `${item.name} General Principle`,
            expression: 'Result = f(Given Parameters)',
            explanation: `Standard governing expression for solving problems on ${item.name}.`,
            variables: [{ symbol: 'Param', meaning: 'Input variables' }],
            whenToUse: `Whenever direct relationship problems in ${item.name} are encountered.`,
            solvedExample: `Apply standard formula substituting the given numerical constraints to achieve final answer.`
          }
        ],
        solvedExamples: [
          {
            title: `Standard ${item.name} Problem 1`,
            question: `In a standard examination question on ${item.name}, when parameter X is 40 and parameter Y is 60, find the resulting output under balanced conditions.`,
            solution: `Applying standard proportional deduction: Output = (40 * 60) / (40 + 60) = 2400 / 100 = 24 units.`,
            explanation: `Step-by-step derivation shows how balance equations lead cleanly to the exact value.`,
            shortcut: `Use harmonic mean or direct proportionality to arrive at 24.`,
            finalAnswer: '24 units'
          },
          {
            title: `Standard ${item.name} Problem 2`,
            question: `If value increases by 20% in the first cycle and decreases by 10% in the second cycle, what is the net overall percentage change?`,
            solution: `Net % change = 20 - 10 + (20 * -10)/100 = 10 - 2 = +8% increase.`,
            explanation: `Successive adjustments result in an 8% gain over base.`,
            shortcut: 'Direct formula: +8%.',
            finalAnswer: '8% increase'
          },
          {
            title: `Standard ${item.name} Problem 3`,
            question: `Find the average of five consecutive integers whose sum is equal to 175.`,
            solution: `Let integers be x-2, x-1, x, x+1, x+2. Sum = 5x = 175 => x = 35. Since x is the middle number, the average is 35.`,
            explanation: `For an arithmetic progression, the average equals the exact middle term.`,
            shortcut: 'Average = Sum / Count = 175 / 5 = 35.',
            finalAnswer: '35'
          },
          {
            title: `Standard ${item.name} Problem 4`,
            question: `A quantity is divided in the ratio 3 : 5. If the smaller portion is 180, find the total quantity.`,
            solution: `3 units = 180 => 1 unit = 60. Total quantity = 3 + 5 = 8 units. Total = 8 * 60 = 480.`,
            explanation: 'Divide the given portion by its ratio weight to find unit multiplier.',
            shortcut: 'Total = (8 / 3) * 180 = 480.',
            finalAnswer: '480'
          },
          {
            title: `Standard ${item.name} Problem 5`,
            question: `What is the missing term in the sequence: 4, 9, 19, 39, ?`,
            solution: `Pattern is (* 2 + 1): 4*2+1=9, 9*2+1=19, 19*2+1=39. Next term = 39*2+1 = 79.`,
            explanation: 'Each term is obtained by doubling the preceding number and adding one.',
            shortcut: '39 * 2 + 1 = 79.',
            finalAnswer: '79'
          }
        ],
        practiceQuestions: [
          {
            id: `pq_${item.slug}_1`,
            question: `What is the primary condition required to solve standard ${item.name} questions accurately?`,
            options: ['Consistent units and verified baseline', 'Relying purely on rough guesswork', 'Ignoring constraints', 'Assuming negative outcomes'],
            correctAnswer: 0,
            difficulty: 'Beginner',
            previousExamRef: 'Banking & Campus placement benchmark',
            explanation: 'Maintaining unit consistency and recognizing the base value avoids arithmetic errors.'
          }
        ],
        testQuestions: [
          {
            id: `tq_${item.slug}_1`,
            question: `In ${item.name}, if two quantities are inversely proportional and one is doubled, the other becomes:`,
            options: ['Halved', 'Doubled', 'Quadrupled', 'Unchanged'],
            correctAnswer: 0,
            explanation: 'Inverse proportionality dictates that doubling one factor halves the reciprocal factor.'
          },
          {
            id: `tq_${item.slug}_2`,
            question: `Which approach is optimal for rapid time-bound solving in ${item.name}?`,
            options: ['Checking unit digits and options elimination', 'Deriving equations from first principles every time', 'Leaving questions unattempted', 'Guessing blindly'],
            correctAnswer: 0,
            explanation: 'Fast elimination of mathematically implausible options saves critical examination seconds.'
          }
        ]
      });
    }

    await Topic.insertMany(topicsData);
    console.log(`Seeded ${topicsData.length} comprehensive topics across all 5 categories.`);

    // 3. Complete Formula Library across topics
    const formulasData = [
      // Percentage
      {
        name: 'Basic Percentage Definition',
        topicSlug: 'percentage',
        topicName: 'Percentage',
        category: 'Quantitative Aptitude',
        expression: 'P = (Value / Total Value) * 100',
        variables: [{ symbol: 'P', meaning: 'Percentage value' }, { symbol: 'Value', meaning: 'Part under consideration' }, { symbol: 'Total Value', meaning: 'Entire baseline' }],
        whenToUse: 'When computing share of a part relative to the whole.',
        solvedExample: { question: 'What percentage of 250 is 65?', solution: '(65 / 250) * 100 = 26%', answer: '26%' },
        tags: ['Fundamental', 'Basics'],
        isImportant: true
      },
      {
        name: 'Percentage Change',
        topicSlug: 'percentage',
        topicName: 'Percentage',
        category: 'Quantitative Aptitude',
        expression: 'Percentage Change = [(Change / Original Value) * 100]',
        variables: [{ symbol: 'Change', meaning: 'New Value - Original Value' }, { symbol: 'Original Value', meaning: 'Starting baseline' }],
        whenToUse: 'When tracking inflation, population growth, or salary increment.',
        solvedExample: { question: 'Price increases from 80 to 100. Find % increase.', solution: '[(100 - 80) / 80] * 100 = (20/80)*100 = 25%', answer: '25%' },
        tags: ['Change', 'Growth'],
        isImportant: true
      },
      {
        name: 'Successive Percentage Changes',
        topicSlug: 'percentage',
        topicName: 'Percentage',
        category: 'Quantitative Aptitude',
        expression: 'Net % Change = a + b + (a * b) / 100',
        variables: [{ symbol: 'a', meaning: 'First percentage change (+ or -)' }, { symbol: 'b', meaning: 'Second percentage change (+ or -)' }],
        whenToUse: 'When two consecutive discounts, taxes, or changes are applied.',
        solvedExample: { question: 'Discount of 20% followed by 10%.', solution: '(-20) + (-10) + ((-20)*(-10))/100 = -30 + 2 = -28%', answer: '28% discount' },
        tags: ['Successive', 'Shortcuts'],
        isImportant: true
      },
      {
        name: 'Product Constancy Ratio (AB Rule)',
        topicSlug: 'percentage',
        topicName: 'Percentage',
        category: 'Quantitative Aptitude',
        expression: 'If A increases by x/y, B must decrease by x/(x + y) to keep product constant',
        variables: [{ symbol: 'x/y', meaning: 'Fractional increase of factor A' }],
        whenToUse: 'Expenditure = Price * Consumption, Distance = Speed * Time.',
        solvedExample: { question: 'Price of petrol rises by 25% (1/4). By how much must consumption decrease?', solution: 'Decrease = 1 / (4 + 1) = 1/5 = 20%', answer: '20%' },
        tags: ['AB Rule', 'Exam Shortcut'],
        isImportant: true
      },

      // Profit and Loss
      {
        name: 'Profit Percentage',
        topicSlug: 'profit-and-loss',
        topicName: 'Profit and Loss',
        category: 'Quantitative Aptitude',
        expression: 'Profit % = [(SP - CP) / CP] * 100',
        variables: [{ symbol: 'SP', meaning: 'Selling Price' }, { symbol: 'CP', meaning: 'Cost Price' }],
        whenToUse: 'When item is sold above cost.',
        solvedExample: { question: 'Bought at 500, sold at 650. Profit %?', solution: '[(650 - 500) / 500] * 100 = (150/500)*100 = 30%', answer: '30%' },
        tags: ['Commercial', 'Basics'],
        isImportant: true
      },
      {
        name: 'Loss Percentage',
        topicSlug: 'profit-and-loss',
        topicName: 'Profit and Loss',
        category: 'Quantitative Aptitude',
        expression: 'Loss % = [(CP - SP) / CP] * 100',
        variables: [{ symbol: 'CP', meaning: 'Cost Price' }, { symbol: 'SP', meaning: 'Selling Price' }],
        whenToUse: 'When selling below cost price.',
        solvedExample: { question: 'Bought at 800, sold at 600. Loss %?', solution: '[(800 - 600) / 800] * 100 = 25%', answer: '25%' },
        tags: ['Loss'],
        isImportant: true
      },
      {
        name: 'Cost to Marked Price Linking Formula',
        topicSlug: 'profit-and-loss',
        topicName: 'Profit and Loss',
        category: 'Quantitative Aptitude',
        expression: 'CP / MP = (100 - Discount %) / (100 + Profit %)',
        variables: [{ symbol: 'CP', meaning: 'Cost Price' }, { symbol: 'MP', meaning: 'Marked Price' }, { symbol: 'Discount', meaning: 'Discount allowed' }, { symbol: 'Profit', meaning: 'Desired profit' }],
        whenToUse: 'When finding markup percentage given both profit and discount percentages.',
        solvedExample: { question: 'Discount = 10%, Profit = 20%. Find CP/MP.', solution: 'CP/MP = (100 - 10) / (100 + 20) = 90 / 120 = 3/4', answer: '3 : 4' },
        tags: ['Markup', 'High Frequency'],
        isImportant: true
      },
      {
        name: 'Same SP Equal Gain and Loss',
        topicSlug: 'profit-and-loss',
        topicName: 'Profit and Loss',
        category: 'Quantitative Aptitude',
        expression: 'Net Loss % = (Common Gain or Loss % / 10)^2',
        variables: [{ symbol: 'x', meaning: 'Common percentage gain and loss' }],
        whenToUse: 'When two articles are sold at the same SP, one at x% profit and other at x% loss.',
        solvedExample: { question: 'Two cars sold at Rs. 2 Lakh each; one at 20% gain, other at 20% loss.', solution: 'Loss % = (20 / 10)^2 = 4%', answer: '4% Loss' },
        tags: ['Shortcut', 'Direct Formula'],
        isImportant: true
      },

      // Simple Interest
      {
        name: 'Simple Interest Expression',
        topicSlug: 'simple-interest',
        topicName: 'Simple Interest',
        category: 'Quantitative Aptitude',
        expression: 'SI = (P * R * T) / 100',
        variables: [{ symbol: 'P', meaning: 'Principal sum' }, { symbol: 'R', meaning: 'Annual interest rate' }, { symbol: 'T', meaning: 'Time period in years' }],
        whenToUse: 'Calculating linear uncompounded return.',
        solvedExample: { question: 'Calculate SI on Rs. 12,000 at 8% for 5 years.', solution: 'SI = (12000 * 8 * 5) / 100 = 4,800', answer: 'Rs. 4,800' },
        tags: ['Interest', 'Banking'],
        isImportant: true
      },
      {
        name: 'Sum Multiplication in SI',
        topicSlug: 'simple-interest',
        topicName: 'Simple Interest',
        category: 'Quantitative Aptitude',
        expression: 'R * T = (N - 1) * 100',
        variables: [{ symbol: 'N', meaning: 'Number of times principal multiplies' }, { symbol: 'R', meaning: 'Rate' }, { symbol: 'T', meaning: 'Years' }],
        whenToUse: 'When a sum doubles, triples, or becomes N times itself in T years.',
        solvedExample: { question: 'A sum triples in 8 years. Find rate R.', solution: 'R * 8 = (3 - 1) * 100 = 200 => R = 25%', answer: '25%' },
        tags: ['Shortcut'],
        isImportant: true
      },

      // Compound Interest
      {
        name: 'Compound Amount Formula',
        topicSlug: 'compound-interest',
        topicName: 'Compound Interest',
        category: 'Quantitative Aptitude',
        expression: 'Amount A = P * (1 + R / 100)^T',
        variables: [{ symbol: 'A', meaning: 'Total matured amount' }, { symbol: 'P', meaning: 'Principal' }, { symbol: 'R', meaning: 'Rate per period' }, { symbol: 'T', meaning: 'Number of compounding periods' }],
        whenToUse: 'When interest is compounded periodically.',
        solvedExample: { question: 'Find amount for Rs. 5,000 at 10% compounded annually for 2 years.', solution: 'A = 5000 * (1 + 0.10)^2 = 5000 * 1.21 = 6,050', answer: 'Rs. 6,050' },
        tags: ['Compound', 'Growth'],
        isImportant: true
      },
      {
        name: 'Difference between CI and SI for 2 Years',
        topicSlug: 'compound-interest',
        topicName: 'Compound Interest',
        category: 'Quantitative Aptitude',
        expression: 'Difference (2 Years) = P * (R / 100)^2',
        variables: [{ symbol: 'Diff', meaning: 'CI - SI' }, { symbol: 'P', meaning: 'Principal' }, { symbol: 'R', meaning: 'Rate percent' }],
        whenToUse: 'Instantly solving 2-year CI and SI comparison problems.',
        solvedExample: { question: 'P = 8,000, R = 5%. Find difference between CI and SI for 2 years.', solution: 'Diff = 8000 * (5/100)^2 = 8000 * (1/400) = Rs. 20', answer: 'Rs. 20' },
        tags: ['Shortcut', 'Exam Favorite'],
        isImportant: true
      },

      // Time and Work
      {
        name: 'Combined Work Rate',
        topicSlug: 'time-and-work',
        topicName: 'Time and Work',
        category: 'Quantitative Aptitude',
        expression: 'Days together = (A * B) / (A + B)',
        variables: [{ symbol: 'A', meaning: 'Time taken by A alone' }, { symbol: 'B', meaning: 'Time taken by B alone' }],
        whenToUse: 'Two individuals working jointly to finish a project.',
        solvedExample: { question: 'A takes 20 days, B takes 30 days. Together?', solution: '(20 * 30) / (20 + 30) = 600 / 50 = 12 days', answer: '12 days' },
        tags: ['Efficiency', 'Work'],
        isImportant: true
      },
      {
        name: 'Man-Days-Hours (MDH) Chain Equation',
        topicSlug: 'time-and-work',
        topicName: 'Time and Work',
        category: 'Quantitative Aptitude',
        expression: '(M1 * D1 * H1) / W1 = (M2 * D2 * H2) / W2',
        variables: [{ symbol: 'M', meaning: 'Men/Workers' }, { symbol: 'D', meaning: 'Days' }, { symbol: 'H', meaning: 'Hours/day' }, { symbol: 'W', meaning: 'Work units' }],
        whenToUse: 'Proportional comparison between working groups.',
        solvedExample: { question: '10 men work 6 hrs/day for 18 days to build 1 road. How many men working 9 hrs/day for 12 days build the same road?', solution: '(10 * 18 * 6) / 1 = (M2 * 12 * 9) / 1 => 1080 = 108 M2 => M2 = 10 men', answer: '10 men' },
        tags: ['Chain Rule', 'High Frequency'],
        isImportant: true
      },

      // Time, Speed and Distance
      {
        name: 'Speed, Time and Distance Basic Relation',
        topicSlug: 'time-speed-and-distance',
        topicName: 'Time, Speed and Distance',
        category: 'Quantitative Aptitude',
        expression: 'Speed = Distance / Time  |  Distance = Speed * Time',
        variables: [{ symbol: 'S', meaning: 'Speed' }, { symbol: 'D', meaning: 'Distance' }, { symbol: 'T', meaning: 'Time' }],
        whenToUse: 'Foundational kinematic calculations.',
        solvedExample: { question: 'A car covers 360 km in 4.5 hours. Speed?', solution: 'Speed = 360 / 4.5 = 80 km/h', answer: '80 km/h' },
        tags: ['Kinematics', 'Speed'],
        isImportant: true
      },
      {
        name: 'Harmonic Average Speed Formula',
        topicSlug: 'time-speed-and-distance',
        topicName: 'Time, Speed and Distance',
        category: 'Quantitative Aptitude',
        expression: 'Average Speed = (2 * x * y) / (x + y)',
        variables: [{ symbol: 'x', meaning: 'Speed on forward trip' }, { symbol: 'y', meaning: 'Speed on return trip' }],
        whenToUse: 'Round trip journeys covering the exact same distance.',
        solvedExample: { question: 'Go at 60 km/h, return at 40 km/h. Average speed?', solution: '(2 * 60 * 40) / (60 + 40) = 4800 / 100 = 48 km/h', answer: '48 km/h' },
        tags: ['Average Speed', 'Trap Question'],
        isImportant: true
      },

      // Ratio and Proportion
      {
        name: 'Compound Ratio & Proportionality',
        topicSlug: 'ratio-and-proportion',
        topicName: 'Ratio and Proportion',
        category: 'Quantitative Aptitude',
        expression: 'If a : b = c : d, then a * d = b * c (Product of Extremes = Product of Means)',
        variables: [{ symbol: 'a, d', meaning: 'Extremes' }, { symbol: 'b, c', meaning: 'Means' }],
        whenToUse: 'Finding fourth proportional or cross-multiplying ratios.',
        solvedExample: { question: 'Find x if 4 : 6 = 10 : x', solution: '4 * x = 6 * 10 => 4x = 60 => x = 15', answer: '15' },
        tags: ['Ratios'],
        isImportant: false
      },

      // Probability
      {
        name: 'Classical Probability',
        topicSlug: 'probability',
        topicName: 'Probability',
        category: 'Quantitative Aptitude',
        expression: 'P(E) = Number of Favorable Outcomes / Total Sample Space N(S)',
        variables: [{ symbol: 'P(E)', meaning: 'Probability of event E (0 <= P <= 1)' }],
        whenToUse: 'Evaluating chance of rolling dice, drawing cards, or random picks.',
        solvedExample: { question: 'Probability of getting a sum of 7 with two fair dice?', solution: 'Favorable: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6. Total = 36. P = 6/36 = 1/6', answer: '1/6' },
        tags: ['Probability', 'Combinatorics'],
        isImportant: true
      },

      // Average
      {
        name: 'Arithmetic Average',
        topicSlug: 'average',
        topicName: 'Average',
        category: 'Quantitative Aptitude',
        expression: 'Average = Sum of all Observations / Number of Observations',
        variables: [{ symbol: 'Sum', meaning: 'Aggregate value' }, { symbol: 'N', meaning: 'Total count' }],
        whenToUse: 'Finding central tendency across data points.',
        solvedExample: { question: 'Average of 12, 18, 24, 30, 36?', solution: 'Sum = 120, Count = 5. Average = 120 / 5 = 24', answer: '24' },
        tags: ['Average', 'Core'],
        isImportant: true
      },

      // Mensuration
      {
        name: 'Volume and Surface Area of Cylinder',
        topicSlug: 'mensuration',
        topicName: 'Mensuration',
        category: 'Quantitative Aptitude',
        expression: 'Volume = pi * r^2 * h  |  Total Surface Area = 2 * pi * r * (r + h)',
        variables: [{ symbol: 'r', meaning: 'Radius of base' }, { symbol: 'h', meaning: 'Height of cylinder' }],
        whenToUse: 'Cylindrical container, pipe, and tank measurements.',
        solvedExample: { question: 'Cylinder with r=7, h=10. Volume?', solution: 'V = (22/7) * 49 * 10 = 1,540 cu. units', answer: '1,540' },
        tags: ['Geometry', '3D'],
        isImportant: true
      }
    ];

    await Formula.insertMany(formulasData);
    console.log(`Seeded ${formulasData.length} comprehensive mathematical formulas.`);

    // 4. Banking Exams, Competitive Exams, and Campus Placements
    const examsData = [
      // Banking
      {
        name: 'IBPS PO',
        slug: 'ibps-po',
        category: 'Banking Exams',
        tagline: 'Institute of Banking Personnel Selection – Probationary Officer',
        frequency: 'Annually (August - November)',
        eligibility: 'Graduate in any discipline from a recognized University (Age 20 - 30)',
        totalMarks: 100,
        durationMinutes: 60,
        negativeMarking: '0.25 marks penalty per incorrect response',
        overview: 'IBPS PO recruits Probationary Officers / Management Trainees across 11 nationalized public sector banks in India. The selection process comprises Prelims, Mains, and an Interview.',
        stages: [
          {
            stageName: 'Preliminary Examination (Objective)',
            mode: 'Computer Based Test (CBT)',
            duration: '60 Minutes (20 mins per section)',
            totalQuestions: 100,
            totalMarks: 100,
            sections: [
              { name: 'Quantitative Aptitude', questions: 35, marks: 35, timeLimit: '20 Mins', syllabus: ['Number Series', 'Quadratic Equations', 'Data Interpretation (Table, Bar, Pie)', 'Arithmetic Word Problems'] },
              { name: 'Reasoning Ability', questions: 35, marks: 35, timeLimit: '20 Mins', syllabus: ['Seating Arrangement', 'Floor & Box Puzzles', 'Syllogism', 'Inequality', 'Blood Relations'] },
              { name: 'English Language', questions: 30, marks: 30, timeLimit: '20 Mins', syllabus: ['Reading Comprehension', 'Cloze Test', 'Error Spotting', 'Sentence Rearrangement'] }
            ]
          }
        ],
        preparationStrategy: [
          { phase: 'Phase 1: Speed Arithmetic', title: 'Speed Math & Tables', description: 'Master multiplication tables up to 30, squares up to 50, cubes up to 25, and fraction-to-percentage conversions.', tips: ['Practice 20 simplification and quadratic equations daily', 'Target 15+ marks in under 8 minutes'] },
          { phase: 'Phase 2: DI Mastery', title: 'Data Interpretation Sprints', description: 'Daily practice of 4 DI sets (Table, Missing DI, and Pie chart combinations).', tips: ['Skip time-consuming single arithmetic questions initially', 'Focus on percentage change calculations'] },
          { phase: 'Phase 3: Mock Testing', title: 'Full Length Exam Simulation', description: 'Take 2 timed mocks weekly in examination time slots with strict 20-minute section discipline.', tips: ['Review every wrong answer and unattempted question', 'Maintain section accuracy above 85%'] }
        ],
        sampleQuestions: [
          {
            question: 'What should come in place of question mark (?) in the following series? 8, 14, 26, 50, 98, (?)',
            section: 'Quantitative Aptitude',
            options: ['194', '192', '186', '196'],
            correctAnswer: 0,
            explanation: 'Difference: 14-8=6, 26-14=12, 50-26=24, 98-50=48. The differences double each step. Next difference = 48 * 2 = 96. Value = 98 + 96 = 194.'
          },
          {
            question: 'Statements: Only a few doctors are engineers. All engineers are scientists. Conclusion: Some scientists are doctors.',
            section: 'Reasoning Ability',
            options: ['Definitely Follows', 'Does not follow', 'Either follows', 'Both follow'],
            correctAnswer: 0,
            explanation: 'The overlap between engineers and doctors falls inside the scientist set. Hence some scientists are definitely doctors.'
          }
        ],
        recommendedTopics: ['percentage', 'data-interpretation', 'syllogism', 'seating-arrangement', 'number-series']
      },
      {
        name: 'SBI PO',
        slug: 'sbi-po',
        category: 'Banking Exams',
        tagline: 'State Bank of India – Probationary Officer Recruitment',
        frequency: 'Annually',
        eligibility: 'Graduation in any discipline; final year students eligible',
        totalMarks: 100,
        durationMinutes: 60,
        negativeMarking: '0.25 marks penalty',
        overview: 'SBI PO is widely regarded as the most prestigious and challenging banking examination in India, renowned for innovative reasoning puzzles and high-level caselet DIs.',
        stages: [
          {
            stageName: 'Preliminary Exam',
            mode: 'Online CBT',
            duration: '60 Minutes',
            totalQuestions: 100,
            totalMarks: 100,
            sections: [
              { name: 'Quantitative Aptitude', questions: 35, marks: 35, timeLimit: '20 Mins', syllabus: ['High Level DI', 'Arithmetic Problems', 'Approximation'] },
              { name: 'Reasoning Ability', questions: 35, marks: 35, timeLimit: '20 Mins', syllabus: ['Multi-variable Puzzles', 'Critical Reasoning', 'Input-Output'] },
              { name: 'English Language', questions: 30, marks: 30, timeLimit: '20 Mins', syllabus: ['Contextual RC', 'Word Swap', 'Para Jumbles'] }
            ]
          }
        ],
        preparationStrategy: [
          { phase: 'Strategy 1', title: 'Tackle Complex Puzzles', description: 'SBI PO features multi-layer puzzles with variable parameters. Dedicate 60 mins daily to blood relations with circular tables.', tips: ['Map possibilities in parallel columns', 'Never get stuck on one clue'] }
        ],
        sampleQuestions: [
          {
            question: 'If a sum of money compounded annually doubles in 4 years, in how many years will it become 16 times itself?',
            section: 'Quantitative Aptitude',
            options: ['16 years', '12 years', '20 years', '14 years'],
            correctAnswer: 0,
            explanation: '16 = 2^4. If 2^1 takes 4 years, then 2^4 takes 4 * 4 = 16 years.'
          }
        ],
        recommendedTopics: ['compound-interest', 'puzzles', 'reading-comprehension']
      },
      {
        name: 'IBPS Clerk',
        slug: 'ibps-clerk',
        category: 'Banking Exams',
        tagline: 'Clerical Cadre Recruitment in Public Sector Banks',
        frequency: 'Annually',
        eligibility: 'Graduation in any discipline',
        totalMarks: 100,
        durationMinutes: 60,
        negativeMarking: '0.25 marks penalty',
        overview: 'IBPS Clerk is known for high-cutoff speed contests where students must attempt 80+ questions with high accuracy.',
        stages: [],
        preparationStrategy: [],
        sampleQuestions: [],
        recommendedTopics: ['simplification', 'approximation', 'percentage']
      },
      {
        name: 'SBI Clerk',
        slug: 'sbi-clerk',
        category: 'Banking Exams',
        tagline: 'Junior Associates (Customer Support & Sales)',
        frequency: 'Annually',
        eligibility: 'Graduation in any discipline',
        totalMarks: 100,
        durationMinutes: 60,
        negativeMarking: '0.25 marks penalty',
        overview: 'Direct clerical entry into State Bank of India branches nationwide with focus on arithmetic speed and language proficiency.',
        stages: [],
        preparationStrategy: [],
        sampleQuestions: [],
        recommendedTopics: ['simplification', 'ratio-and-proportion', 'seating-arrangement']
      },
      {
        name: 'RBI Assistant',
        slug: 'rbi-assistant',
        category: 'Banking Exams',
        tagline: 'Reserve Bank of India Assistant Recruitment',
        frequency: 'Annually / Biennially',
        eligibility: 'Graduation with minimum 50% marks',
        totalMarks: 100,
        durationMinutes: 60,
        negativeMarking: '0.25 marks penalty',
        overview: 'Prestigious entry into the central banking authority of India with computer aptitude included in Mains.',
        stages: [],
        preparationStrategy: [],
        sampleQuestions: [],
        recommendedTopics: ['operating-systems', 'networking-basics', 'table-di']
      },
      {
        name: 'RBI Grade B',
        slug: 'rbi-grade-b',
        category: 'Banking Exams',
        tagline: 'Direct Recruitment for Managerial Grade B Officers',
        frequency: 'Annually',
        eligibility: 'Graduation with minimum 60% marks',
        totalMarks: 200,
        durationMinutes: 120,
        negativeMarking: '0.25 marks penalty',
        overview: 'The elite civil-services equivalent banking examination consisting of General Awareness, Quant, Reasoning, and English in Phase 1.',
        stages: [],
        preparationStrategy: [],
        sampleQuestions: [],
        recommendedTopics: ['data-interpretation', 'syllogism', 'reading-comprehension']
      },

      // Competitive Exams
      {
        name: 'SSC CGL',
        slug: 'ssc-cgl',
        category: 'Competitive Exams',
        tagline: 'Staff Selection Commission – Combined Graduate Level',
        frequency: 'Annually',
        eligibility: 'Bachelor’s degree from a recognized university',
        totalMarks: 200,
        durationMinutes: 60,
        negativeMarking: '0.50 marks penalty per wrong answer in Tier 1',
        overview: 'SSC CGL selects candidates for Group B and C gazetted and non-gazetted positions across ministries and departments of the Government of India (Inspectors, Enforcement Officers, Auditors).',
        stages: [
          {
            stageName: 'Tier-1 Examination (Computer Based)',
            mode: 'Online CBT',
            duration: '60 Minutes',
            totalQuestions: 100,
            totalMarks: 200,
            sections: [
              { name: 'General Intelligence and Reasoning', questions: 25, marks: 50, timeLimit: 'Composite', syllabus: ['Analogy', 'Number Series', 'Coding-Decoding', 'Matrix'] },
              { name: 'Quantitative Aptitude', questions: 25, marks: 50, timeLimit: 'Composite', syllabus: ['Geometry', 'Mensuration', 'Trigonometry', 'Algebra', 'Arithmetic'] },
              { name: 'General Awareness', questions: 25, marks: 50, timeLimit: 'Composite', syllabus: ['History', 'Polity', 'Current Affairs', 'Science'] },
              { name: 'English Comprehension', questions: 25, marks: 50, timeLimit: 'Composite', syllabus: ['Vocab', 'Idioms', 'Error Spotting'] }
            ]
          }
        ],
        preparationStrategy: [
          { phase: 'Strategy 1', title: 'Advance Math Domination', description: 'Unlike banking, SSC CGL devotes 40-50% of Quant to Advance Math: Geometry, Trigonometry, Algebra, and Mensuration.', tips: ['Memorize circle chord theorems', 'Learn trigonometry standard angles'] }
        ],
        sampleQuestions: [
          {
            question: 'If x + 1/x = 5, then the value of x^2 + 1/x^2 is:',
            section: 'Quantitative Aptitude',
            options: ['23', '25', '27', '21'],
            correctAnswer: 0,
            explanation: 'Squaring both sides: (x + 1/x)^2 = x^2 + 1/x^2 + 2 = 25 => x^2 + 1/x^2 = 25 - 2 = 23.'
          }
        ],
        recommendedTopics: ['algebra', 'geometry', 'mensuration', 'profit-and-loss']
      },
      {
        name: 'SSC CHSL',
        slug: 'ssc-chsl',
        category: 'Competitive Exams',
        tagline: 'Combined Higher Secondary Level (10+2) Examination',
        frequency: 'Annually',
        eligibility: '12th Standard or equivalent',
        totalMarks: 200,
        durationMinutes: 60,
        negativeMarking: '0.50 marks penalty',
        overview: 'Recruitment for Lower Division Clerk (LDC), Junior Secretariat Assistant (JSA), and Data Entry Operator (DEO).',
        stages: [],
        preparationStrategy: [],
        sampleQuestions: [],
        recommendedTopics: ['algebra', 'percentage', 'analogy']
      },
      {
        name: 'RRB NTPC',
        slug: 'rrb-ntpc',
        category: 'Competitive Exams',
        tagline: 'Railway Recruitment Boards – Non-Technical Popular Categories',
        frequency: 'Periodic',
        eligibility: '12th / Graduate depending on post',
        totalMarks: 100,
        durationMinutes: 90,
        negativeMarking: '1/3rd marks penalty',
        overview: 'Recruitment for Station Master, Goods Guard, Commercial Apprentice, and Traffic Assistant in Indian Railways.',
        stages: [],
        preparationStrategy: [],
        sampleQuestions: [],
        recommendedTopics: ['time-speed-and-distance', 'problems-on-trains', 'number-series']
      },
      {
        name: 'UPSC CSAT',
        slug: 'upsc-csat',
        category: 'Competitive Exams',
        tagline: 'Civil Services Aptitude Test (Prelims Paper II)',
        frequency: 'Annually (May / June)',
        eligibility: 'Graduate in any discipline',
        totalMarks: 200,
        durationMinutes: 120,
        negativeMarking: '1/3rd marks penalty',
        overview: 'Qualifying paper (33% required = 66 marks out of 200) testing high-order reading comprehension, numeracy, and data sufficiency.',
        stages: [],
        preparationStrategy: [],
        sampleQuestions: [],
        recommendedTopics: ['reading-comprehension', 'permutation-and-combination', 'data-sufficiency']
      }
    ];

    await Exam.insertMany(examsData);
    console.log(`Seeded ${examsData.length} competitive & banking exams.`);

    // 5. Campus Placement Companies (TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini, Zoho, HCL)
    const companiesData = [
      {
        name: 'TCS',
        slug: 'tcs',
        tagline: 'Tata Consultancy Services – National Qualifier Test (NQT)',
        hiringRoles: ['Ninja (3.6 LPA)', 'Digital (7.0 LPA)', 'Prime (9.0 LPA)'],
        ctcRange: '3.6 LPA - 9.0 LPA',
        overview: 'TCS NQT is the single largest campus recruitment assessment in India. It evaluates Numerical Ability, Verbal Ability, Reasoning Ability, and Advanced Coding.',
        assessmentPattern: {
          totalDurationMinutes: 80,
          totalQuestions: 65,
          sections: [
            { name: 'Numerical Ability', questions: 20, durationMinutes: 25, difficulty: 'Moderate', topics: ['Number System', 'Time and Work', 'Profit and Loss', 'Percentages'] },
            { name: 'Reasoning Ability', questions: 20, durationMinutes: 25, difficulty: 'Moderate', topics: ['Blood Relations', 'Seating Arrangement', 'Data Sufficiency', 'Coding Decoding'] },
            { name: 'Verbal Ability', questions: 25, durationMinutes: 30, difficulty: 'Easy-Moderate', topics: ['Error Spotting', 'Sentence Completion', 'Para Jumbles'] }
          ]
        },
        rounds: [
          { roundNumber: 1, roundName: 'TCS NQT Online Cognitive & Technical Test', description: 'Adaptive multi-section test with no negative marking on cognitive sections.', mode: 'Online Proctored', keyFocus: ['Speed', 'Accuracy', 'Core CS fundamentals'] },
          { roundNumber: 2, roundName: 'Technical Interview', description: 'Deep dive into resume projects, OOPs concepts, DBMS, and basic coding.', mode: 'In-person / Virtual', keyFocus: ['Project architecture', 'Data structures'] },
          { roundNumber: 3, roundName: 'HR & Managerial Round', description: 'Behavioral assessment, relocation willingness, and corporate culture fit.', mode: 'In-person / Virtual', keyFocus: ['Communication', 'Attitude'] }
        ],
        practiceQuestions: [
          {
            section: 'Numerical Ability',
            question: 'A shopkeeper sells two pens at Rs. 20 each. On one he gains 10% and on the other he loses 10%. His net gain or loss is:',
            options: ['1% loss', '1% gain', 'No loss no gain', '2% loss'],
            correctAnswer: 0,
            explanation: 'When sold at equal price with x% gain and x% loss, always loss = (x/10)^2 % = (10/10)^2 = 1% loss.',
            yearAsked: 'TCS NQT 2024'
          },
          {
            section: 'Reasoning Ability',
            question: 'In a code language, if COMPUTER is written as RFUVQNPC, then how is MEDICINE written in that code?',
            options: ['EOJDJEFM', 'MFEDJJOE', 'EOJDEJFM', 'MFEJDJOE'],
            correctAnswer: 0,
            explanation: 'Reverse the order and increment letters: C...R becomes R...C, intermediate letters incremented by 1.',
            yearAsked: 'TCS NQT 2023'
          }
        ],
        interviewTips: [
          { category: 'Technical Tips', points: ['Know your final year project inside out; draw system architecture diagrams on paper', 'Be ready to explain normalization in DBMS with real examples'] },
          { category: 'HR Tips', points: ['Emphasize readiness to work in rotational shifts and relocations', 'Exhibit humility and continuous learning attitude'] }
        ]
      },
      {
        name: 'Infosys',
        slug: 'infosys',
        tagline: 'Infosys Specialist Programmer & Systems Engineer Drive',
        hiringRoles: ['Systems Engineer (3.6 LPA)', 'Digital Specialist Engineer (6.5 LPA)', 'Specialist Programmer (9.5 LPA)'],
        ctcRange: '3.6 LPA - 9.5 LPA',
        overview: 'Infosys placement drive tests mathematical dexterity, critical puzzle solving, and verbal reasoning with strictly timed individual sections.',
        assessmentPattern: {
          totalDurationMinutes: 100,
          totalQuestions: 54,
          sections: [
            { name: 'Mathematical Ability', questions: 10, durationMinutes: 35, difficulty: 'High', topics: ['Permutation & Combination', 'Probability', 'Geometry', 'Number Series'] },
            { name: 'Logical & Critical Reasoning', questions: 15, durationMinutes: 25, difficulty: 'Moderate-High', topics: ['Data Sufficiency', 'Syllogism', 'Statement Assumptions'] },
            { name: 'Verbal Ability', questions: 20, durationMinutes: 20, difficulty: 'Moderate', topics: ['Reading Comprehension', 'Sentence Correction'] },
            { name: 'Pseudocode & Puzzle Solving', questions: 9, durationMinutes: 20, difficulty: 'High', topics: ['Bitwise logic', 'Loops recursion'] }
          ]
        },
        rounds: [
          { roundNumber: 1, roundName: 'Infosys Online Aptitude & Coding Test', description: 'Strict section-wise time locks; cannot switch sections.', mode: 'Online', keyFocus: ['Advanced Math', 'Logic'] },
          { roundNumber: 2, roundName: 'Technical & HR Discussion', description: 'Comprehensive interview on programming paradigms and college projects.', mode: 'Virtual', keyFocus: ['Problem solving'] }
        ],
        practiceQuestions: [
          {
            section: 'Mathematical Ability',
            question: 'In how many different ways can the letters of the word "LEADING" be arranged such that vowels always come together?',
            options: ['720', '360', '1440', '5040'],
            correctAnswer: 0,
            explanation: 'Vowels: E, A, I (3 vowels). Consonants: L, D, N, G (4). Treat vowels as single block: 5! = 120. Vowels rearrange among themselves: 3! = 6. Total ways = 120 * 6 = 720.',
            yearAsked: 'Infosys Campus 2024'
          }
        ],
        interviewTips: [
          { category: 'Aptitude Focus', points: ['Infosys Math questions are notoriously wordy and concept-heavy; practice permutations and mixtures extensively'] }
        ]
      },
      {
        name: 'Wipro',
        slug: 'wipro',
        tagline: 'Wipro Elite National Talent Hunt (NTH)',
        hiringRoles: ['Project Engineer (3.5 LPA)', 'Turbo (6.5 LPA)'],
        ctcRange: '3.5 LPA - 6.5 LPA',
        overview: 'Wipro NTH evaluates Quantitative, Logical, English, Coding, and an essay writing evaluation in its online assessment.',
        assessmentPattern: {
          totalDurationMinutes: 120,
          totalQuestions: 60,
          sections: [
            { name: 'Quantitative Aptitude', questions: 16, durationMinutes: 16, difficulty: 'Moderate', topics: ['Speed Time Distance', 'Percentages', 'Ages'] },
            { name: 'Logical Reasoning', questions: 14, durationMinutes: 14, difficulty: 'Moderate', topics: ['Deductive Reasoning', 'Series'] },
            { name: 'Verbal Ability', questions: 22, durationMinutes: 18, difficulty: 'Moderate', topics: ['Grammar', 'Synonyms'] }
          ]
        },
        rounds: [
          { roundNumber: 1, roundName: 'Elite Assessment', description: 'Aptitude + Coding + Written Communication.', mode: 'Online', keyFocus: ['Time management'] }
        ],
        practiceQuestions: [
          {
            section: 'Quantitative Aptitude',
            question: 'A and B can do a work in 12 days, B and C in 15 days, C and A in 20 days. In how many days will all three together finish the work?',
            options: ['10 days', '12 days', '15 days', '8 days'],
            correctAnswer: 0,
            explanation: '2(A+B+C) = 1/12 + 1/15 + 1/20 = (5+4+3)/60 = 12/60 = 1/5. A+B+C = 1/10. So together they take 10 days.',
            yearAsked: 'Wipro NTH'
          }
        ],
        interviewTips: [
          { category: 'Preparation', points: ['Practice speed solving because Wipro gives approximately 1 minute per question'] }
        ]
      },
      {
        name: 'Accenture',
        slug: 'accenture',
        tagline: 'Accenture Associate Software Engineer (ASE) & FSE',
        hiringRoles: ['Associate Software Engineer (4.5 LPA)', 'Advanced ASE (6.5 LPA)'],
        ctcRange: '4.5 LPA - 6.5 LPA',
        overview: 'Accenture’s cognitive and technical assessment features no negative marking, testing Cognitive Ability, Technical Assessment (Pseudocode, Common Application & MS Office, Cloud Fundamentals).',
        assessmentPattern: {
          totalDurationMinutes: 90,
          totalQuestions: 90,
          sections: [
            { name: 'Cognitive Assessment', questions: 50, durationMinutes: 50, difficulty: 'Moderate', topics: ['Critical Reasoning', 'Abstract Reasoning', 'English'] },
            { name: 'Technical Assessment', questions: 40, durationMinutes: 40, difficulty: 'Moderate', topics: ['Pseudocode', 'MS Office & Cloud', 'Network Security'] }
          ]
        },
        rounds: [
          { roundNumber: 1, roundName: 'Cognitive & Technical Assessment', description: 'Elimination round. Must clear section-wise cutoffs.', mode: 'Online', keyFocus: ['Accuracy'] },
          { roundNumber: 2, roundName: 'Coding Assessment', description: '2 programming problems in 45 minutes.', mode: 'Online', keyFocus: ['Algorithms'] }
        ],
        practiceQuestions: [
          {
            section: 'Technical Assessment',
            question: 'Which Excel function is used to search for a value in the leftmost column of a table and return a value in the same row from another column?',
            options: ['VLOOKUP', 'HLOOKUP', 'INDEX', 'MATCH'],
            correctAnswer: 0,
            explanation: 'VLOOKUP performs vertical lookup searching top to bottom in the leftmost column.',
            yearAsked: 'Accenture ASE'
          }
        ],
        interviewTips: [
          { category: 'Key Topics', points: ['Revise MS Excel shortcuts and basic Cloud service models (IaaS, PaaS, SaaS)'] }
        ]
      },
      {
        name: 'Cognizant',
        slug: 'cognizant',
        tagline: 'Cognizant GenC, GenC Elevate & GenC Next',
        hiringRoles: ['GenC (4.0 LPA)', 'GenC Elevate (4.25 LPA)', 'GenC Next (6.75 LPA)'],
        ctcRange: '4.0 LPA - 6.75 LPA',
        overview: 'Cognizant utilizes AMCAT / Superset platforms with questions testing Quantitative ability, Analytical ability, and English grammar.',
        assessmentPattern: { totalDurationMinutes: 100, totalQuestions: 60, sections: [] },
        rounds: [],
        practiceQuestions: [],
        interviewTips: []
      },
      {
        name: 'Capgemini',
        slug: 'capgemini',
        tagline: 'Capgemini Exceller Campus Recruitment',
        hiringRoles: ['Analyst (4.0 LPA)', 'Senior Analyst (5.75 LPA)'],
        ctcRange: '4.0 LPA - 7.5 LPA',
        overview: 'Features game-based aptitude testing (Grid Challenge, Motion Challenge, Switch Challenge), English test, and Pseudocode test.',
        assessmentPattern: { totalDurationMinutes: 80, totalQuestions: 50, sections: [] },
        rounds: [],
        practiceQuestions: [],
        interviewTips: []
      },
      {
        name: 'Zoho',
        slug: 'zoho',
        tagline: 'Zoho Software Development Engineer Recruitment',
        hiringRoles: ['Software Developer (6.0 - 8.5 LPA)', 'Member Technical Staff (10+ LPA)'],
        ctcRange: '6.0 LPA - 12.0 LPA',
        overview: 'Famous for skipping conventional corporate HR rounds. Focuses intensely on Pure Aptitude (Round 1), Basic Programming (Round 2), Advanced Programming (Round 3), and System Design (Round 4).',
        assessmentPattern: { totalDurationMinutes: 90, totalQuestions: 30, sections: [] },
        rounds: [],
        practiceQuestions: [
          {
            section: 'Quantitative Aptitude',
            question: 'Find the unit digit of (7^95 - 3^58).',
            options: ['4', '0', '6', '7'],
            correctAnswer: 0,
            explanation: 'Cyclicity of 7 is 4: 95 % 4 = 3 => 7^3 ends in 3. Cyclicity of 3 is 4: 58 % 4 = 2 => 3^2 ends in 9. (13 - 9) = 4.',
            yearAsked: 'Zoho Round 1'
          }
        ],
        interviewTips: []
      },
      {
        name: 'HCL',
        slug: 'hcl',
        tagline: 'HCLTech First Careers & Campus Hiring',
        hiringRoles: ['Graduate Trainee Engineer (3.6 - 4.5 LPA)'],
        ctcRange: '3.6 LPA - 5.0 LPA',
        overview: 'Structured aptitude and fundamental programming assessment geared towards engineering graduates.',
        assessmentPattern: { totalDurationMinutes: 75, totalQuestions: 60, sections: [] },
        rounds: [],
        practiceQuestions: [],
        interviewTips: []
      }
    ];

    await Company.insertMany(companiesData);
    console.log(`Seeded ${companiesData.length} campus recruitment company dossiers.`);

    // 6. Mock Tests (Full Length, Sectional, Topic-Wise)
    const mockTestsData = [
      {
        title: 'IBPS PO Prelims All-India Championship Mock 1',
        slug: 'ibps-po-prelims-mock-1',
        category: 'Banking',
        examSlug: 'ibps-po',
        examName: 'IBPS PO',
        type: 'Full Mock',
        durationMinutes: 20, // compact mock for easy interactive testing
        totalQuestions: 15,
        totalMarks: 15,
        difficulty: 'Exam Level',
        instructions: [
          'The examination contains 15 questions across Quantitative Aptitude, Reasoning Ability, and English Language.',
          'Each correct answer carries 1 mark. Each incorrect answer incurs a penalty of 0.25 marks.',
          'You may mark questions for review and return to them anytime before timer expiry.'
        ],
        questions: [
          // Quant
          {
            id: 'q1',
            section: 'Quantitative Aptitude',
            question: 'The average weight of 8 persons increases by 2.5 kg when a new person comes in place of one of them weighing 65 kg. What is the weight of the new person?',
            options: ['85 kg', '75 kg', '80 kg', '70 kg'],
            correctAnswer: 0,
            explanation: 'Total weight increase = 8 * 2.5 = 20 kg. Weight of new person = 65 + 20 = 85 kg.',
            marks: 1,
            negativeMarks: 0.25
          },
          {
            id: 'q2',
            section: 'Quantitative Aptitude',
            question: 'Two pipes A and B can fill a tank in 20 minutes and 30 minutes respectively. If both pipes are opened together, the time taken to fill the tank is:',
            options: ['12 minutes', '15 minutes', '10 minutes', '14 minutes'],
            correctAnswer: 0,
            explanation: 'Time = (20 * 30) / (20 + 30) = 600 / 50 = 12 minutes.',
            marks: 1,
            negativeMarks: 0.25
          },
          {
            id: 'q3',
            section: 'Quantitative Aptitude',
            question: 'A boat can travel with a speed of 13 km/h in still water. If the speed of the stream is 4 km/h, find the time taken by the boat to go 68 km downstream.',
            options: ['4 hours', '5 hours', '3.5 hours', '4.5 hours'],
            correctAnswer: 0,
            explanation: 'Downstream speed = 13 + 4 = 17 km/h. Time = 68 / 17 = 4 hours.',
            marks: 1,
            negativeMarks: 0.25
          },
          {
            id: 'q4',
            section: 'Quantitative Aptitude',
            question: 'In how many ways can 6 people be seated in a circle?',
            options: ['120', '720', '60', '240'],
            correctAnswer: 0,
            explanation: 'Circular permutations of n items = (n - 1)! = (6 - 1)! = 5! = 120.',
            marks: 1,
            negativeMarks: 0.25
          },
          {
            id: 'q5',
            section: 'Quantitative Aptitude',
            question: 'Find the perimeter of a semi-circle of radius 14 cm (Take pi = 22/7).',
            options: ['72 cm', '44 cm', '88 cm', '56 cm'],
            correctAnswer: 0,
            explanation: 'Perimeter of semicircle = pi*r + 2r = (22/7 * 14) + 2(14) = 44 + 28 = 72 cm.',
            marks: 1,
            negativeMarks: 0.25
          },
          // Reasoning
          {
            id: 'q6',
            section: 'Reasoning Ability',
            question: 'Pointing to a photograph of a boy, Suresh said, "He is the son of the only son of my mother." How is Suresh related to that boy?',
            options: ['Father', 'Brother', 'Uncle', 'Grandfather'],
            correctAnswer: 0,
            explanation: 'Only son of Suresh’s mother is Suresh himself. So the boy is Suresh’s son. Hence Suresh is the Father.',
            marks: 1,
            negativeMarks: 0.25
          },
          {
            id: 'q7',
            section: 'Reasoning Ability',
            question: 'Statements: All mangoes are golden. No golden is cheap. Conclusions: I. No mango is cheap. II. Cheap are not mangoes.',
            options: ['Both I and II follow', 'Only I follows', 'Only II follows', 'Neither follows'],
            correctAnswer: 0,
            explanation: 'Since mangoes are inside golden, and golden has no overlap with cheap, mangoes cannot overlap with cheap. Both conclusions follow.',
            marks: 1,
            negativeMarks: 0.25
          },
          {
            id: 'q8',
            section: 'Reasoning Ability',
            question: 'A man walks 5 km East, turns right and walks 4 km, then turns left and walks 5 km. In which direction is he now facing?',
            options: ['East', 'South', 'West', 'North'],
            correctAnswer: 0,
            explanation: 'Facing East -> Turn right -> Facing South -> Turn left -> Facing East again.',
            marks: 1,
            negativeMarks: 0.25
          },
          {
            id: 'q9',
            section: 'Reasoning Ability',
            question: 'In a row of 40 girls, when Kamal was shifted to her left by 4 places her number from the left end of the row became 10. What was the number of Swati from the right end of the row if Swati was three places to the right of Kamal’s original position?',
            options: ['24', '22', '26', '25'],
            correctAnswer: 0,
            explanation: 'Kamal’s original position from left = 10 + 4 = 14. Swati is 3 places right of original = 14 + 3 = 17 from left. Swati from right = 40 - 17 + 1 = 24.',
            marks: 1,
            negativeMarks: 0.25
          },
          {
            id: 'q10',
            section: 'Reasoning Ability',
            question: 'If "CLOUD" is coded as "59432" and "RAIN" is coded as "1678", how is "AROUND" coded?',
            options: ['614372', '614382', '614392', '613472'],
            correctAnswer: 0,
            explanation: 'Direct letter substitution: A=6, R=1, O=4, U=3, N=7 (or 8), D=2. Fits 614372.',
            marks: 1,
            negativeMarks: 0.25
          },
          // English
          {
            id: 'q11',
            section: 'English Language',
            question: 'Identify the error in the sentence: "Neither the manager (A) / nor the employees (B) / was present at the conference (C) / No error (D)"',
            options: ['Part C', 'Part B', 'Part A', 'Part D'],
            correctAnswer: 0,
            explanation: 'With "Neither... nor", the verb agrees with the closer subject ("the employees", plural). It should be "were present". Error is in Part C.',
            marks: 1,
            negativeMarks: 0.25
          },
          {
            id: 'q12',
            section: 'English Language',
            question: 'Select the synonym of "PRAGMATIC":',
            options: ['Practical', 'Idealistic', 'Impulsive', 'Theoretical'],
            correctAnswer: 0,
            explanation: 'Pragmatic means dealing with things sensibly and realistically in a practical manner.',
            marks: 1,
            negativeMarks: 0.25
          },
          {
            id: 'q13',
            section: 'English Language',
            question: 'Choose the antonym of "MITIGATE":',
            options: ['Aggravate', 'Alleviate', 'Relieve', 'Soothe'],
            correctAnswer: 0,
            explanation: 'Mitigate means make less severe. The opposite is aggravate (make worse).',
            marks: 1,
            negativeMarks: 0.25
          },
          {
            id: 'q14',
            section: 'English Language',
            question: 'Fill in the blank: "The committee agreed _______ the proposal after a prolonged debate."',
            options: ['to', 'with', 'on', 'about'],
            correctAnswer: 0,
            explanation: 'One agrees TO a plan, proposal, or action (and agrees WITH a person).',
            marks: 1,
            negativeMarks: 0.25
          },
          {
            id: 'q15',
            section: 'English Language',
            question: 'Meaning of idiom "Burn the midnight oil":',
            options: ['Work or study late into the night', 'Waste fuel carelessly', 'Destroy evidence secretly', 'Set fire to properties'],
            correctAnswer: 0,
            explanation: '"Burn the midnight oil" means to study or work hard late into the night.',
            marks: 1,
            negativeMarks: 0.25
          }
        ]
      },
      {
        title: 'TCS NQT National Placement Simulator',
        slug: 'tcs-nqt-placement-simulator',
        category: 'Campus Placement',
        examSlug: 'tcs',
        examName: 'TCS NQT',
        type: 'Company Specific',
        durationMinutes: 15,
        totalQuestions: 10,
        totalMarks: 10,
        difficulty: 'Moderate',
        instructions: ['Standard TCS NQT format assessing Quant and Reasoning.'],
        questions: [
          {
            id: 'tcs_q1',
            section: 'Numerical Ability',
            question: 'If log 2 = 0.3010 and log 3 = 0.4771, the value of log 5 is:',
            options: ['0.6990', '0.7781', '0.1761', '0.6020'],
            correctAnswer: 0,
            explanation: 'log 5 = log(10/2) = log 10 - log 2 = 1 - 0.3010 = 0.6990.',
            marks: 1,
            negativeMarks: 0
          },
          {
            id: 'tcs_q2',
            section: 'Numerical Ability',
            question: 'A sum of money invested at simple interest triples in 12 years. In how many years will it become 5 times itself?',
            options: ['24 years', '20 years', '18 years', '30 years'],
            correctAnswer: 0,
            explanation: '(T1/T2) = (3-1)/(5-1) = 2/4 = 1/2 => T2 = 12 * 2 = 24 years.',
            marks: 1,
            negativeMarks: 0
          },
          {
            id: 'tcs_q3',
            section: 'Numerical Ability',
            question: 'The ratio between the length and breadth of a rectangular field is 3 : 2. If its perimeter is 300 m, its area is:',
            options: ['5,400 sq. m', '6,000 sq. m', '4,800 sq. m', '5,000 sq. m'],
            correctAnswer: 0,
            explanation: '2(3x + 2x) = 10x = 300 => x = 30. L = 90, B = 60. Area = 90 * 60 = 5,400 sq. m.',
            marks: 1,
            negativeMarks: 0
          },
          {
            id: 'tcs_q4',
            section: 'Reasoning Ability',
            question: 'Find the next number in sequence: 2, 6, 12, 20, 30, 42, (?)',
            options: ['56', '54', '58', '60'],
            correctAnswer: 0,
            explanation: 'n*(n+1): 1*2=2, 2*3=6, 3*4=12, 4*5=20, 5*6=30, 6*7=42, 7*8=56.',
            marks: 1,
            negativeMarks: 0
          },
          {
            id: 'tcs_q5',
            section: 'Reasoning Ability',
            question: 'If South-East becomes North, North-East becomes West and so on, what will West become?',
            options: ['South-East', 'North-East', 'South-West', 'North-West'],
            correctAnswer: 0,
            explanation: 'Each direction turns by 135 degrees anti-clockwise. West turned 135 anti-clockwise becomes South-East.',
            marks: 1,
            negativeMarks: 0
          }
        ]
      },
      {
        title: 'SSC CGL Tier 1 Quantitative Speed Test',
        slug: 'ssc-cgl-quant-speed-test',
        category: 'Competitive',
        examSlug: 'ssc-cgl',
        examName: 'SSC CGL',
        type: 'Sectional Test',
        durationMinutes: 15,
        totalQuestions: 10,
        totalMarks: 20,
        difficulty: 'Exam Level',
        instructions: ['Dedicated 10-question speed drill for Advance Math & Arithmetic.'],
        questions: [
          {
            id: 'ssc_q1',
            section: 'Quantitative Aptitude',
            question: 'If tan theta = 4/3, find the value of (sin theta + cos theta).',
            options: ['7/5', '1/5', '5/7', '8/5'],
            correctAnswer: 0,
            explanation: 'Right triangle with opposite=4, adjacent=3 => hypotenuse=5. sin = 4/5, cos = 3/5. Sum = 7/5.',
            marks: 2,
            negativeMarks: 0.5
          },
          {
            id: 'ssc_q2',
            section: 'Quantitative Aptitude',
            question: 'The angles of a triangle are in the ratio 2 : 3 : 5. The measure of the largest angle is:',
            options: ['90 degrees', '75 degrees', '100 degrees', '80 degrees'],
            correctAnswer: 0,
            explanation: '2x + 3x + 5x = 10x = 180 => x = 18. Largest = 5 * 18 = 90 degrees.',
            marks: 2,
            negativeMarks: 0.5
          }
        ]
      }
    ];

    await MockTest.insertMany(mockTestsData);
    console.log(`Seeded ${mockTestsData.length} interactive mock tests.`);

    // 7. Today's Daily Practice Challenge (5 Quant, 5 Reasoning, 5 Verbal)
    const todayStr = new Date().toISOString().split('T')[0];
    const dailyChallengeData = {
      dateString: todayStr,
      title: 'Daily Aptitude Sprint – 15 Question Master Drill',
      totalQuestions: 15,
      durationMinutes: 15,
      questions: [
        // 5 Quant
        {
          id: 'dc_q1',
          section: 'Quantitative Aptitude',
          question: 'What is 35% of 180 + 25% of 240?',
          options: ['123', '125', '118', '130'],
          correctAnswer: 0,
          explanation: '35% of 180 = 63. 25% of 240 = 60. 63 + 60 = 123.'
        },
        {
          id: 'dc_q2',
          section: 'Quantitative Aptitude',
          question: 'A train 150m long passes a man standing on platform in 9 seconds. The speed of the train is:',
          options: ['60 km/h', '54 km/h', '72 km/h', '48 km/h'],
          correctAnswer: 0,
          explanation: 'Speed = 150/9 m/s = (150/9) * (18/5) = 30 * 2 = 60 km/h.'
        },
        {
          id: 'dc_q3',
          section: 'Quantitative Aptitude',
          question: 'Find the simple interest on Rs. 4,000 at 5% per annum for 3 years.',
          options: ['Rs. 600', 'Rs. 500', 'Rs. 700', 'Rs. 800'],
          correctAnswer: 0,
          explanation: 'SI = (4000 * 5 * 3)/100 = 600.'
        },
        {
          id: 'dc_q4',
          section: 'Quantitative Aptitude',
          question: 'If A : B = 2 : 3 and B : C = 4 : 5, then A : C is:',
          options: ['8 : 15', '2 : 5', '6 : 15', '3 : 5'],
          correctAnswer: 0,
          explanation: 'A/C = (A/B) * (B/C) = (2/3) * (4/5) = 8/15.'
        },
        {
          id: 'dc_q5',
          section: 'Quantitative Aptitude',
          question: 'A shopkeeper marks an article at Rs. 500 and gives a 10% discount. If cost price is Rs. 360, his profit % is:',
          options: ['25%', '20%', '30%', '15%'],
          correctAnswer: 0,
          explanation: 'SP = 500 * 0.9 = 450. Profit = 450 - 360 = 90. Profit % = (90/360)*100 = 25%.'
        },

        // 5 Logical Reasoning
        {
          id: 'dc_q6',
          section: 'Logical Reasoning',
          question: 'In a code, TEACHER is coded as VGCEJGT. How is CHILDREN coded?',
          options: ['EJKNFTGP', 'EJKNFTHP', 'EJKNETGP', 'EJKNFTFP'],
          correctAnswer: 0,
          explanation: 'Every letter shifts +2 positions: C->E, H->J, I->K, L->N, D->F, R->T, E->G, N->P.'
        },
        {
          id: 'dc_q7',
          section: 'Logical Reasoning',
          question: 'Find the odd one out: 27, 64, 125, 144, 216',
          options: ['144', '27', '64', '125'],
          correctAnswer: 0,
          explanation: 'All others are perfect cubes (3^3=27, 4^3=64, 5^3=125, 6^3=216). 144 is 12^2 (not a cube).'
        },
        {
          id: 'dc_q8',
          section: 'Logical Reasoning',
          question: 'If A is the brother of B, B is the sister of C, and C is the father of D, how is D related to A?',
          options: ['Nephew or Niece', 'Brother', 'Son', 'Uncle'],
          correctAnswer: 0,
          explanation: 'A and B are siblings of C. D is C’s child, so D is the nephew or niece of A.'
        },
        {
          id: 'dc_q9',
          section: 'Logical Reasoning',
          question: 'Select the missing number: 3, 7, 15, 31, (?)',
          options: ['63', '61', '59', '65'],
          correctAnswer: 0,
          explanation: 'Pattern: *2 + 1. 31 * 2 + 1 = 63.'
        },
        {
          id: 'dc_q10',
          section: 'Logical Reasoning',
          question: 'Statements: All pens are pencils. Some pencils are scales. Conclusion: Some scales are pens.',
          options: ['Does not definitely follow', 'Definitely follows', 'Both follow', 'Neither follows'],
          correctAnswer: 0,
          explanation: 'No direct relationship between scales and pens is established.'
        },

        // 5 Verbal Ability
        {
          id: 'dc_q11',
          section: 'Verbal Ability',
          question: 'Spot the misspelt word:',
          options: ['Accomodate', 'Occurrence', 'Embarrass', 'Millennium'],
          correctAnswer: 0,
          explanation: 'Correct spelling is ACCOMMODATE (with double c and double m).'
        },
        {
          id: 'dc_q12',
          section: 'Verbal Ability',
          question: 'One word substitution: "A person who loves books and reading"',
          options: ['Bibliophile', 'Philanthropist', 'Polyglot', 'Misologist'],
          correctAnswer: 0,
          explanation: 'A bibliophile is a lover of books.'
        },
        {
          id: 'dc_q13',
          section: 'Verbal Ability',
          question: 'Antonym of "CANDID":',
          options: ['Deceptive', 'Frank', 'Honest', 'Blunt'],
          correctAnswer: 0,
          explanation: 'Candid means truthful and straightforward. Deceptive is the exact antonym.'
        },
        {
          id: 'dc_q14',
          section: 'Verbal Ability',
          question: 'Idiom: "A blessing in disguise" means:',
          options: ['An apparent misfortune that eventually has good results', 'A holy curse', 'A hidden monetary prize', 'A disguised enemy'],
          correctAnswer: 0,
          explanation: 'Something that seems bad at first, but turns out for the best.'
        },
        {
          id: 'dc_q15',
          section: 'Verbal Ability',
          question: 'Fill in the blank: "She is capable _______ solving complex mathematical riddles."',
          options: ['of', 'for', 'in', 'at'],
          correctAnswer: 0,
          explanation: 'The adjective "capable" takes the preposition "of" + gerund.'
        }
      ]
    };

    await DailyChallenge.create(dailyChallengeData);
    console.log('Seeded today’s Daily Practice Challenge (15 questions).');

    // 8. Seed sample previous test attempt for student
    const sampleMock = await MockTest.findOne({ slug: 'ibps-po-prelims-mock-1' });
    if (sampleMock) {
      await TestAttempt.create({
        user: studentUser._id,
        userEmail: studentUser.email,
        userName: studentUser.name,
        mockTest: sampleMock._id,
        testTitle: sampleMock.title,
        category: sampleMock.category,
        score: 11.25,
        maxMarks: 15,
        accuracy: 80,
        totalQuestions: 15,
        correctCount: 12,
        incorrectCount: 3,
        unattemptedCount: 0,
        timeSpentSeconds: 940,
        sectionWise: [
          { section: 'Quantitative Aptitude', score: 3.75, total: 5, correct: 4, incorrect: 1, accuracy: 80 },
          { section: 'Reasoning Ability', score: 4.0, total: 5, correct: 4, incorrect: 0, accuracy: 100 },
          { section: 'English Language', score: 3.5, total: 5, correct: 4, incorrect: 2, accuracy: 66 }
        ],
        answers: [],
        completedAt: new Date(Date.now() - 86400000)
      });
      console.log('Seeded initial student test attempt.');
    }

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error during database seed:', err);
    process.exit(1);
  }
}

seedDatabase();
