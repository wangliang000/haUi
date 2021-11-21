const xml2js = require('xml2js');
const groupKeys = ['and', 'or'];

function valueToXml(value) {
  if (!value) return;
  const json = JSON.parse(JSON.stringify(value));
  const jsonLogic = jsonToJsonLogic(json);
  return { rule: { element: jsonLogicToXml(jsonLogic, true) } };
}
//value---->jsonLogic

function jsonToJsonLogic(value) {
  if (!value || !Array.isArray(value)) return;
  //去除无关字段
  const obj = clearUselessField(value, ['key']);
  return dealJson(obj);
}
function dealJson(obj) {
  if (!obj) return;
  const res = obj.map((_r) => {
    if (_r.children) {
      const rules = dealJson(_r.children);
      return { [_r.condition]: rules };
    }
    return dealJsonLastObject(_r);
  });
  return res;
}
function dealJsonLastObject(obj) {
  const variable = { var: obj.var };
  return { [obj.condition]: [variable, obj.result] };
}

function clearUselessField(data, keys) {
  return data.map((_d) => {
    if (_d.children) {
      const children = clearUselessField(_d.children, keys);
      return { condition: _d.condition, children };
    }
    return delTheSameField(_d, keys);
  });
}
function delTheSameField(obj, keys) {
  for (const k in obj) {
    if (keys.includes(k)) {
      delete obj[k];
    }
  }
  return obj;
}
//jsonLogic---->Xml
function jsonLogicToXml(jsonLogic, isOnce) {
  if (!jsonLogic) return;
  const xmlFormate = jsonLogic.map((_j) => {
    const key = Object.keys(_j)[0];
    if (groupKeys.includes(key)) {
      const rules = jsonLogicToXml(_j[key], false);
    //   console.log(JSON.stringify(rules), '原值');
    //   console.log(JSON.stringify(), '插值');
      return {
        $: { type: 'expression' },
        element: insertOperation(rules, key),
      };
    }
    if (isOnce) {
      return dealLastJsonLogic(_j);
    } else {
      return { $: { type: 'expression' }, element: dealLastJsonLogic(_j) };
    }
  });

  return xmlFormate;
}

function insertOperation(rules, op) {
  const result = [];
  for (let i = 0; i < rules.length; i++) {
    result.push(rules[i]);
    if (i < rules.length-1) {
      result.push({
        $: {
          type: 'op',
          value: op,
        },
      });
    }
  }
  return result;
}

function dealLastJsonLogic(item) {
  const operation = Object.keys(item)[0];
  const [variable, result] = item[operation];
  const type = Object.keys(variable)[0];
  return [
    {
      $: { type, value: variable[type] },
    },
    {
      $: { type: 'op', value: operation },
    },
    {
      $: { type: 'const', value: result },
    },
  ];
  //   return { $: { type: objKey, value: variable[objKey] } };
}

const values = [
  {
    condition: 'and',
    key: '10001',
    children: [
      {
        condition: 'and',
        children: [
          { var: '是否登记', condition: '==', result: 'false' },
          { var: '是否登记', condition: '==', result: 'false' },
        ],
      },
      {
        condition: 'and',
        children: [
          { var: '是否登记', condition: '==', result: 'false' },
          { var: '是否登记', condition: '==', result: 'false' },
          {
            condition: 'and',
            children: [
              { var: '是否登记', condition: '==', result: 'false' },
              { var: '是否登记', condition: '==', result: 'false' },
            ],
          },
        ],
      },
    ],
  },
];

const jsonLogic = [
  {
    and: [
      { '==': [{ var: '是否登记' }, 'false'] },
      { '==': [{ var: '是否登记' }, 'false'] },
    ],
  },
  {
    and: [
      { '==': [{ var: '是否登记' }, 'false'] },
      { '==': [{ var: '是否登记' }, 'false'] },
      {
        and: [
          { '==': [{ var: '是否登记' }, 'false'] },
          { '==': [{ var: '是否登记' }, 'false'] },
        ],
      },
    ],
  },
];

function valueToXmlDom(value) {
  const xmlJson = valueToXml(value);
  return new xml2js.Builder().buildObject(xmlJson);
}
console.log(JSON.stringify(valueToXmlDom(values)), 'logggggggg');
