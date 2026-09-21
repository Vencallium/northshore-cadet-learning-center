// Study aid based on the current CAP drill pamphlet and practical-test scorecards.
// These paraphrases do not replace CAPP 60-33, CAPP 60-34, or an instructor.
const DRILL_SOURCES = {
  manual: "https://www.gocivilairpatrol.com/media/cms/P_6033_2217FEEE8C89F.pdf",
  tests: "https://www.gocivilairpatrol.com/media/cms/CAPP_6034_Sept_24_3e0cc652c818b.pdf"
};

const FALL_IN_STEPS = [
  "Hear FALL IN, then move promptly to an open place. The guide and element leaders establish the formation first; do not run through or across other cadets.",
  "If you are an element leader, line up directly behind the first element leader. If you are not, take an open place to the left of an element leader in one of the elements.",
  "Automatically perform Dress Right, DRESS: extend the left arm, look 45° right, and adjust until your shoulder-to-fingertip interval and alignment are correct.",
  "If you are behind another cadet, cover directly behind that person and establish the prescribed front-to-rear distance. Use small steps to correct position.",
  "When dress, cover, interval, and distance are set, automatically execute Ready, FRONT. Drop the arm, face front, bring heels together, and remain at attention.",
  "If the number of cadets does not divide evenly among the elements, follow the flight staff's direction as they square off the left flank. Extra positions are filled in the last element first, then upward toward the first."
];

// Each cell is [stage, overhead pose, visual cue]. Poses are schematic, not scale drawings.
// The scorecard sequence is kept separate from these teaching illustrations.
const DRILL_SCENES = {
  fallin: [["Find your place", "line", "Join an open slot left of the element leader"], ["Dress and cover", "align", "Look right; line up with neighbors and the cadet ahead"], ["Ready front", "attention", "Arms down; face front at attention"]],
  parade: [["Attention", "attention", "Heels together"], ["Parade rest", "wide", "LEFT foot moves out; right foot stays planted"]],
  salute: [["Attention", "attention", "Feet remain still"], ["Salute", "salute", "RIGHT hand rises; body stays facing front"]],
  order: [["Salute", "salute", "Hold position"], ["Order arms", "attention", "RIGHT hand returns to the side"]],
  about: [["Start", "attention", "Face front"], ["Count one", "aboutSet", "RIGHT ball behind/left of LEFT heel"], ["Count two", "rear", "Pivot RIGHT 180°: RIGHT ball + LEFT heel"]],
  dress: [["Start", "line", "Stay in your rank"], ["Dress right", "align", "LEFT arm out; head 45° right; adjust"], ["Hold", "align", "Align shoulder to fingertip"]],
  ready: [["Dress right", "align", "Arm extended and eyes right"], ["Ready front", "attention", "Arm down; eyes front; feet at attention"]],
  rightface: [["Start", "attention", "Face front"], ["Count one", "rightTurn", "Pivot RIGHT 90°: LEFT ball + RIGHT heel"], ["Count two", "right", "LEFT foot joins RIGHT"]],
  cover: [["Before", "offset", "You are out of line with the cadet ahead"], ["Adjust", "column", "Small steps put you directly behind"], ["Finish", "column", "Hold correct distance and interval"]],
  atease: [["Attention", "attention", "Both heels together"], ["At ease", "relaxed", "RIGHT foot stays planted; stay in place and silent"]],
  attention: [["At ease", "relaxed", "RIGHT foot stays in place"], ["Flight", "wide", "Assume parade rest"], ["Attention", "attention", "LEFT foot joins RIGHT"]],
  handsalute: [["Start", "attention", "Feet stay still"], ["Count one", "salute", "RIGHT hand to brow/headgear"], ["Count two", "attention", "Hand returns to side"]],
  eyes: [["Front", "attention", "Body faces front"], ["Eyes right", "eyesRight", "Only head and eyes turn 45° right"]],
  eyesfront: [["Eyes right", "eyesRight", "Feet and shoulders stay front"], ["Ready front", "attention", "Head and eyes return front"]],
  fallout: [["In ranks", "line", "Stay at attention until FALL OUT"], ["Fall out", "disperse", "Break ranks or relax; remain nearby"]],
  forward: [["At halt", "attention", "Wait for MARCH"], ["First step", "leftForward", "LEFT foot steps off"], ["Cadence", "march", "Alternate feet, keeping alignment"]],
  double: [["Quick time", "march", "Normal step and arm swing"], ["One more step", "march", "Complete one quick-time step"], ["Double time", "run", "Increase pace; maintain formation"]],
  quick: [["Double time", "run", "Continue running"], ["Two more steps", "run", "Complete two double-time steps"], ["Quick time", "march", "Resume normal step and arm swing"]],
  halt: [["Marching", "march", "Hear HALT on a foot strike"], ["One more step", "leftForward", "Take one more full step"], ["Halt", "attention", "Trailing foot joins; heels together"]],
  openranks: [["Two ranks", "ranks", "Both ranks aligned"], ["Open", "openRanks", "Front rank: 3 paces; second: 2"], ["Dress", "openRanks", "Both ranks halt and dress right"]],
  closeranks: [["Open ranks", "openRanks", "Front rank stands fast"], ["Close", "ranks", "Second rank: 1 pace forward"], ["Finish", "ranks", "Return to normal distance"]],
  rightstep: [["Start", "attention", "Heels together"], ["Count one", "rightOut", "RIGHT foot 12 in to the side"], ["Count two", "shiftRight", "LEFT foot joins; repeat in cadence"]],
  sidestophalt: [["Side stepping", "rightOut", "Hear HALT when heels meet"], ["One more", "rightOut", "RIGHT foot takes one more step"], ["Finish", "shiftRight", "LEFT foot joins at attention"]],
  rightflank: [["March", "march", "MARCH as RIGHT heel strikes"], ["Pivot", "pivotRight", "One more step; pivot RIGHT on LEFT ball"], ["Step off", "rightMarch", "RIGHT foot moves in new direction"]],
  leftflank: [["March", "march", "MARCH as LEFT heel strikes"], ["Pivot", "pivotLeft", "One more step; pivot LEFT on RIGHT ball"], ["Step off", "leftMarch", "LEFT foot moves in new direction"]],
  cadence: [["March", "march", "Keep the marching rhythm"], ["Sound off", "march", "Count 1–2–3–4 aloud with steps"]],
  rear: [["March", "march", "MARCH as RIGHT heel strikes"], ["12-in step", "rearSet", "LEFT foot ahead, in line with RIGHT"], ["Pivot", "rearPivot", "Turn RIGHT 180° on BOTH balls"], ["New direction", "rearMarch", "LEFT 12-in step, then RIGHT full step"]]
};

const DRILL_SCENE_KEYS = {
  "achievement-1": ["fallin", "parade", "salute", "order", "about", "dress", "ready", "rightface", "cover", "atease", "attention", "handsalute", "eyes", "eyesfront", "fallout"],
  "achievement-2": ["forward", "double", "quick", "halt", "openranks", "ready", "closeranks", "rightstep", "sidestophalt", "forward", "rightflank", "leftflank", "cadence", "rear", "halt"]
};

// Video demonstrations linked by the CAP Bessemer Composite Squadron drill library.
// Times map each CAPP 60-34 scorecard item to the matching explanation/demonstration.
const DRILL_VIDEOS = {
  "achievement-1": {
    id: "eb1Rs6djH84",
    title: "Achievement 1 Drill & Ceremonies | Stationary Drill – CAPP 60-34",
    creator: "Redberryweo",
    clips: [[137,307],[340,494],[497,556],[556,579],[584,722],[725,925],[925,944],[945,992],[992,1033],[1044,1100],[1071,1082],[1100,1169],[1169,1189],[1189,1200],[1200,1224]]
  },
  "achievement-2": {
    id: "awV1K690490",
    title: "Achievement 2 Drill & Ceremonies | Basic Marching – CAPP 60-34",
    creator: "Redberryweo",
    clips: [[114,195],[195,242],[242,270],[323,362],[376,665],[665,703],[703,743],[703,731],[725,731],[114,195],[737,819],[819,848],[848,868],[868,899],[899,904]]
  }
};

// Supplemental full-body demonstrations. These show cadets carrying the movements through
// at normal pace; the timed CAP clips above remain the command-by-command teaching source.
const DRILL_PERFORMANCE_VIDEOS = {
  "achievement-1": [
    {
      id: "GuYgG5_VOf0",
      title: "Achievement 1 Drill Test",
      creator: "C/CMSgt Noah Schalbrack",
      note: "Watch a CAP cadet work through the Achievement 1 movements as a test sequence."
    },
    {
      id: "1wFEABLXqAQ",
      title: "AFROTC Basic Drill Movements",
      creator: "AFROTC Detachment 330",
      note: "Full-body views of stationary positions, facing movements, salutes, dress, cover, and formations."
    }
  ],
  "achievement-2": [
    {
      id: "AscQCk51ps8",
      title: "Air Force Marching Movements",
      creator: "AFROTC Detachment 592",
      note: "Cadets demonstrate basic marching movements while maintaining cadence and formation."
    },
    {
      id: "1wFEABLXqAQ",
      title: "AFROTC Basic Drill Movements",
      creator: "AFROTC Detachment 330",
      note: "A wider formation view of forward march, flight halt, dress, cover, and related fundamentals."
    }
  ]
};

// Each entry follows the CAPP 60-34 scorecard order. Counts are instructional cues,
// not a substitute for the command's formal timing in CAPP 60-33.
const DRILL_GUIDES = [
  {
    id: "achievement-1", title: "Achievement 1 · Curry", subtitle: "Basic drill as an element member",
    setup: "At least three cadets form one element. The tested cadet is not on a flank. Fifteen graded commands; at least 11 satisfactory performances pass.",
    moves: [
      ["FALL IN", ["ONE — Take your place in line and automatically dress right.", "TWO — Make small alignment and spacing corrections; cover the cadet in front if there is one.", "THREE — Automatically bring arm and head to the front and finish at attention."], "fallin"],
      ["Parade, REST", ["ONE — Move the left foot left until the inside edges of the heels are about 12 inches apart and on one line.", "At the same time, place the right hand in the left palm behind the back. Keep head and eyes forward; remain still and silent."], "parade"],
      ["Present, ARMS", ["ONE — Raise the right hand smartly to the prescribed salute position; keep the rest of the body at attention."], "attention"],
      ["Order, ARMS", ["ONE — Retrace the salute's path smartly downward. Cup the hand by the waist and finish at attention."], "attention"],
      ["About, FACE", ["ONE — Place the ball of the right foot about half a shoe length behind and just left of the left heel; keep legs straight but not locked.", "Ready, TWO — Pivot 180° clockwise on the ball of the right foot and heel of the left. End with heels together and feet at attention."], "about"],
      ["Dress Right, DRESS", ["ONE — Snap the left arm straight out at shoulder height, palm down; turn head and eyes 45° right.", "Adjust with small steps until aligned with the rank and the proper shoulder-to-fingertip interval is established."], "fallin"],
      ["Ready, FRONT", ["ONE — Snap the head and eyes forward while lowering the left arm without slapping the leg. Resume attention."], "attention"],
      ["Right, FACE", ["ONE — Pivot 90° right on the ball of the left foot and heel of the right, keeping the upper body at attention.", "Ready, TWO — Bring the left foot alongside the right; heels together, feet at the attention angle."], "rightface"],
      ["COVER", ["ONE — In column, use small choppy steps if needed to line up behind the cadet ahead and establish proper interval and distance."], "cover"],
      ["AT EASE", ["ONE — Relax while standing, keep the right foot planted, remain in place, and stay silent."], "atease"],
      ["Flight, ATTENTION", ["On Flight — Assume parade rest and stop moving or talking.", "On ATTENTION — Bring the left foot to the right and resume the position of attention."], "attention"],
      ["Hand, SALUTE", ["ONE — Raise the right arm smartly; fingers, palm, and forearm align, with the middle finger at the prescribed point on headgear or brow.", "Ready, TWO — Bring the hand down on the same path and finish at attention."], "attention"],
      ["Eyes, RIGHT", ["ONE — Turn head and eyes smartly 45° right; keep the body facing front."], "attention"],
      ["Ready, FRONT", ["ONE — Return head and eyes smartly to the front."], "attention"],
      ["FALL OUT", ["ONE — Break ranks and remain nearby so the group can reassemble quickly."], "none"]
    ]
  },
  {
    id: "achievement-2", title: "Achievement 2 · Arnold", subtitle: "Basic drill as a flight member",
    setup: "At least six cadets form a flight of two elements. FALL IN and setup facings are not graded. Fifteen graded commands; at least 11 satisfactory performances pass.",
    moves: [
      ["Forward, MARCH", ["On MARCH — Step off with the left foot only after the command of execution; take the normal 24-inch step and establish cadence."], "forward"],
      ["Double Time, MARCH", ["ONE — Take one more step at quick time after MARCH.", "TWO — Step into double time; keep interval and alignment with the flight."], "forward"],
      ["Quick Time, MARCH", ["ONE–TWO — Take two more steps in double time after MARCH.", "THREE — Resume quick time and normal coordinated arm swing."], "forward"],
      ["Flight, HALT", ["ONE — After HALT, take one more 24-inch step.", "TWO — Bring the trailing foot smartly beside the leading foot; heels aligned at attention."], "halt"],
      ["Open Ranks, MARCH", ["On MARCH — First element takes three paces; second element takes two. Keep moving straight ahead.", "After halting — Automatically execute Dress Right, DRESS and align the rank."], "openranks"],
      ["Ready, FRONT", ["ONE — Lower the left arm with snap, without slapping the leg; turn head and eyes forward."], "attention"],
      ["Close Ranks, MARCH", ["On MARCH — First element stands fast. Second element takes one pace forward and halts at attention."], "openranks"],
      ["Right Step, MARCH", ["ONE — Move the right foot 12 inches to the right, keeping the leg straight but not stiff.", "TWO — Bring the left foot smartly beside the right without scraping the ground. Repeat in cadence until halted."], "rightstep"],
      ["Flight, HALT (side step)", ["ONE — Take one more right step after HALT.", "TWO — Bring the left foot alongside the right and finish at attention."], "rightstep"],
      ["Forward, MARCH (again)", ["On MARCH — Step off with the left foot, without anticipating the command."], "forward"],
      ["Right Flank, MARCH", ["ONE — Take one more 24-inch step after MARCH, then pivot 90° right on the ball of the left foot; suspend arm swing during the pivot.", "TWO — Step off on the right foot in the new direction and maintain dress, cover, interval, and distance."], "flank"],
      ["Left Flank, MARCH", ["ONE — Take one more 24-inch step after MARCH, then pivot 90° left on the ball of the right foot; suspend arm swing during the pivot.", "TWO — Step off on the left foot in the new direction and maintain alignment and spacing."], "flank"],
      ["Count Cadence, COUNT", ["After COUNT — Sound off clearly, without shouting: ONE–TWO–THREE–FOUR, ONE–TWO–THREE–FOUR. Separate each number."], "forward"],
      ["To the Rear, MARCH", ["ONE — After MARCH on the right foot, take a 12-inch step with the left foot in front of and in line with the right.", "TWO — Pivot 180° to the right on the balls of both feet; suspend arm swing.", "THREE — Take a 12-inch left step in the new direction, then a full 24-inch right step."], "rear"],
      ["Flight, HALT", ["ONE — Take one more 24-inch step after HALT.", "TWO — Bring the trailing foot smartly alongside the lead foot. Heels together, body at attention."], "halt"]
    ]
  }
];
