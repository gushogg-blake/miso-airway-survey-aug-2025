export let name = "Misophonia and Airway/Myofunction";

export let title = name;

let qs = `
Do you have misophonia?

yesno

Do you have misokinesia?

yesno

Do you regularly snore?

yesno

Have you been diagnosed with sleep apnea?

yesno

Have you been diagnosed with upper airway resistance syndrome?

yesno

Do you have TMJ disorder such as pain, clicking, or popping of the jaw joint?

yesno

Do you habitually breathe through your mouth?

yesnonotsure

Can you suction your tongue to the roof of your mouth?

yesnonotsure

Does your tongue naturally rest suctioned to the roof of your mouth?

yesnonotsure

When eating, do you use an adult swallow pattern? (An adult swallow pattern involves pressing the tongue upwards and can be done while maintaining a blank expression, whereas an infant swallow pattern recruits the cheek muscles and involves lip movement. Many adults still use an infant swallow!)

yesnonotsure

When drinking, do you use an adult swallow pattern?

yesnonotsure

Have you had any teeth removed due to crowding?

yesno

Have you had any wisdom teeth removed due to crowding, lack of space to emerge, or impacted teeth?

yesno
`.trim().split("\n\n");

let pairs = [];

for (let i = 0; i < qs.length; i += 2) {
	let [q, type] = qs.slice(i, i + 2);
	
	pairs.push({type, q});
}

export {pairs as questions};
