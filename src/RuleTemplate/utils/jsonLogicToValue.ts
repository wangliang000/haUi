export default function jsonLogicToValue(jsonLogic) {
  if (!jsonLogic) return;
  const data = jsonLogic;
  console.log(JSON.stringify(data), '入参--->json');
  const [condition, rules] = dealConditionGroup(data);
  const children = dealData(rules);
  const result = { condition, children };
  console.log(result, 'value----》')
  return [result];
}

function dealData(data) {
  const result = data.map((_d) => {
    if (isGroup(_d)) {
      const [condition, rules] = dealConditionGroup(_d);
      return { condition, children: dealData(rules) };
    }
    return dealItem(_d);
  });
  return result;
}

function dealItem(item) {
  const condition = getCondition(item);
  const rule = item[condition];
  return { var: rule[0].var, condition, result: rule[1] };
}

function dealConditionGroup(obj) {
  const condition = getCondition(obj);
  const rules = obj[condition];
  return [condition, rules];
}
function isGroup(_c) {
  const key = getCondition(_c);
  const conditions = ['and', 'or'];
  return conditions.includes(key);
}

function getCondition(obj) {
  return Object.keys(obj)[0];
}
//   const data = {
//     and: [
//       { '==': [{ var: '11' }, 'false'] },
//       { '>=': [{ var: '测试率' }, '90%'] },
//       {
//         and: [
//           { '==': [{ var: '11' }, 'false'] },
//           { '>=': [{ var: '测试率' }, '90%'] },
//         ],
//       },
//     ],
//   };
// console.log(JSON.stringify(jsonLogicToValue(data)), 'jsonLogicToValue');
