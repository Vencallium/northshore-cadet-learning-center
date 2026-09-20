// Study aid based on the current CAP drill pamphlet and practical-test scorecards.
// These paraphrases do not replace CAPP 60-33, CAPP 60-34, or an instructor.
const DRILL_SOURCES = {
  manual: "https://www.gocivilairpatrol.com/media/cms/P_6033_2217FEEE8C89F.pdf",
  tests: "https://www.gocivilairpatrol.com/media/cms/CAPP_6034_Sept_24_3e0cc652c818b.pdf"
};

const FALL_IN_STEPS = [
  "Hear FALL IN, then move promptly to an open place in the flight's line formation. Do not run through or across the formation.",
  "Element leaders establish the front-to-rear files. As an element member, stand to the left of your element leader or the cadet already in your rank.",
  "Automatically perform Dress Right, DRESS: extend the left arm, look 45° right, and adjust until your shoulder-to-fingertip interval and alignment are correct.",
  "If you are behind another cadet, cover directly behind that person and establish the prescribed front-to-rear distance. Use small steps to correct position.",
  "When dress, cover, interval, and distance are set, automatically execute Ready, FRONT. Drop the arm, face front, bring heels together, and remain at attention."
];

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
