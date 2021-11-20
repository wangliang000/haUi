import { Button } from 'antd';
import React, { CSSProperties, FC, memo, useCallback, useState } from 'react';
import RuleItem from '../RuleItem';
import { nanoid } from 'nanoid';
import MappingComp from '../mapping';
const itemValue = { readonly: false, value: '1' };
const defaultValue = {
  params: itemValue,
  condition: itemValue,
  result: itemValue,
};
type groupType = 'and' | 'or';
const RuleGroup: FC<IRuleGroupProps> = memo(({ data, color = '#fff' }) => {
  const [all, setAll] = useState<{ key: string }[]>([{ key: nanoid() }]);
  const [type, setType] = useState<groupType>('and');
  const handleAdd = (type: groupType) => {
    setType(type);

    setAll((v) => {
      v.push({ key: nanoid() });
      console.log(v);
      return [...v];
    });
  };
  const handleDel = useCallback((key: string) => {
    setAll((v) => {
      if (v.length == 1) {
        return v;
      }
      const res = v.filter((v) => v.key != key);
      return res;
    });
  }, []);
  console.log(
    all.map((item) => item.key),
    '------->',
  );
  return (
    <div
      style={{
        border: '1px solid #090',
        background: color,
        padding: '20px 40px',
      }}
    >
      <MappingComp data={data} />
      {/* {data.map((item, index) => {
        return;
      })} */}
      <div>
        <Button
          onClick={() => {
            handleAdd('and');
          }}
        >
          +且
        </Button>
        <Button
          onClick={() => {
            handleAdd('or');
          }}
        >
          +或
        </Button>
      </div>
    </div>
  );
});

export default RuleGroup;

interface IRuleGroupProps {
  data: Array<any>;
  color?: string;
}
