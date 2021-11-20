import React, { FC, memo } from 'react';
import RuleGroup from '../RuleGroup';
import RuleItem from '../RuleItem';

const itemValue = { readonly: false, value: '1' };
const defaultValue = {
  params: itemValue,
  condition: itemValue,
  result: itemValue,
};

const MappingComp: FC<IMappingComp> = memo(({ data }) => {
  return (
    <div>
      {data.map((item) => {
        return !item.children ? (
          <RuleItem {...defaultValue} />
        ) : (
          <RuleGroup color="#f00" data={item.children} />
        );
      })}
    </div>
  );
});

export default MappingComp;

interface IMappingComp {
  data: Array<any>;
}
