import xml2js from 'xml2js';
import jsonLogicToValue from './jsonLogicToValue'
/*
*   jsonLogic 就是一个规则模板，
*   定义每一个位置每一个阶级代表什么意思
    目标： 1.完成xml转换为jsonLogic  👌🏻
        2. 完成多情的xml、转换 👌🏻
        3. 完成组件产物---》jsonLogic转换为xml
*/

// const jsonLogic = {
//     and: [
//         { '==': [{ var: 'platform' }, 'mm'] },
//         { '>': [{ var: 'v' }, 101] },
//         { '==': [{ var: 'page' }, 'home'] },
//         {
//             and: [
//                 { '==': [{ var: 'platform' }, 'mm'] },
//                 { '>': [{ var: 'v' }, 101] },
//                 { '==': [{ var: 'page' }, 'home'] },
//             ],
//         },
//     ],
// };

const xml = `
    <rule>
    <element type='expression'>
        <element type='expression'> 
           <element type='var' value='是否登记' ></element>
           <element type='op' value='==' ></element>
           <element type='const' value='false' ></element>
        </element>
        <element type='op' value ='and'></element>
        <element type='expression'>
           <element type='var' value='是否登记' ></element>
           <element type='op' value='==' ></element>
           <element type='const' value='false' ></element>
        </element>
    </element>
    <element type='op' value='and'></element>
    <element type='expression'>
        <element type='expression'>
           <element type='var' value='是否登记' ></element>
           <element type='op' value='==' ></element>
           <element type='const' value='false' ></element>
        </element>
        <element type='op' value ='and'></element>
        <element type='expression'>
           <element type='var' value='是否登记' ></element>
           <element type='op' value='==' ></element>
           <element type='const' value='false' ></element>
        </element>
        <element type='expression'>
            <element type='expression'>
                <element type='var' value='是否登记' ></element>
                <element type='op' value='==' ></element>
                <element type='const' value='false' ></element>
            </element>
            <element type='op' value ='and'></element>
            <element type='expression'>
                <element type='var' value='是否登记' ></element>
                <element type='op' value='==' ></element>
                <element type='const' value='false' ></element>
            </element>
            <element type='expression'>
        <element type='expression'>
           <element type='var' value='是否登记' ></element>
           <element type='op' value='==' ></element>
           <element type='const' value='false' ></element>
        </element>
        <element type='op' value ='and'></element>
        <element type='expression'>
           <element type='var' value='是否登记' ></element>
           <element type='op' value='==' ></element>
           <element type='const' value='false' ></element>
        </element>
    </element>
         </element>
    </element>
    </rule>`;
// console.log(new xml2js.Builder().buildObject(result), 'json----->');

function xmlToJsonLogic(xml: string, xmlConfig: XMLConfig) {
    if (!xml) return;
    const result = {};
    new xml2js.Parser().parseString(xml, (err: Error, res: JSON) => {
        if (err) {
            throw Error(err.message);
        }
        const { root, element } = xmlConfig;
        let cloningRule = JSON.parse(JSON.stringify(res))[root][element];
        let [ruleOUterOperation, rules] = getOperationAndRules(cloningRule);
        if (!ruleOUterOperation) {
            ruleOUterOperation = 'and';
        }
        result[ruleOUterOperation] = JsonToJsonLogic(rules, { element });
    });
    return result;
}
//遍历处理各级关系，处理成jsonLogic格式
function JsonToJsonLogic(arr, { element }: { element: string }) {
    const [ruleOUterOperation, rules] = getOperationAndRules(arr);
    const result = rules.map((item) => {
        return everyRuleAndGroup(item[element], { element });
    });
    if (ruleOUterOperation) {
        return { [ruleOUterOperation]: result };
    }
    return result;
}

export const res = jsonLogicToValue(xmlToJsonLogic(xml, { root: 'rule', element: 'element' }))

/*
 * @params params:{[element]:[]} ,ruleConfig :{element:''}
 * @return true |false  false 是群组，true是规则
 */

function isNotLastRule(params, { element }: Pick<XMLConfig, 'element'>, isOnce: boolean) {
    if (params && Array.isArray(params)) {
        return params.some((_n) => {
            if (_n[element] && Array.isArray(_n[element])) {
                if (!isOnce) {
                    return true;
                }
                return !isNotLastRule(_n[element], { element }, false);
            }
            return false;
        });
    }
    return false;
}

function getOperationAndRules(_v) {
    let ruleOUterOperation;
    const rules = _v.filter((_r) => {
        if (_r.$.type === 'op') {
            ruleOUterOperation = _r.$.value;
            return false;
        }
        return true;
    });
    return [ruleOUterOperation, rules];
}
function lastRuleFormatter(rule) {
    const ruleItem = rule.map((r) => r['$']);
    return {
        [ruleItem[1].value]: [{ var: ruleItem[0].value }, ruleItem[2].value],
    };
}

function everyRuleAndGroup(item, xmlConfig: Pick<XMLConfig, 'element'>) {
    const { element } = xmlConfig;
    let res;
    if (isNotLastRule(item, { element }, true)) {
        res = JsonToJsonLogic(item, { element });
    } else {
        res = lastRuleFormatter(item);
    }
    return res;
}


interface XMLConfig {
    root: string;
    element: string;
}