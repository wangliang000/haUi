import React, { Children, memo } from 'react';
import MappingComp from './mapping';
import RuleGroup from './RuleGroup';
import { res } from './utils/xmlToJsonLogic';

const data = [
  {
    children: [{ name: 1 }, { name: 1 }, { children: [{ name:1 }] }],
  },
  {
    children: [
      { name: 1 },
      { name: 1 },
      {
        children: [{ name: 1 }, { name: 1 }, { children: [{name:1  }] }],
      },
    ],
  },
];
console.log(res, 'res');
export default memo(() => {
  return (
    <div>
      测试代码案发地方
      {res?.map((g) => (
        <RuleGroup data={g.children} />
      ))}
    </div>
  );
});
