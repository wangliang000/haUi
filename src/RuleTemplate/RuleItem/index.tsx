import React, { FC, memo } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const RuleItem: FC<IRuleItemProps> = memo((props) => {
  const { params, handleDel, condition, result, index } = props;
  console.log(index, 'keyy');
  const handleDelItem = () => {
    if (!index) return;
    handleDel && handleDel(index);
  };
  return (
    <div
      style={{
        height: '60px',
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <div style={{ width: '30%' }}>
        <Select
          disabled={params?.readonly}
          defaultValue={params?.value}
          style={{ width: '200px' }}
        >
          <Option value={'1'}>1</Option>
          <Option value={'2'}>2</Option>
          <Option value={'3'}>3</Option>
        </Select>
      </div>
      <div style={{ width: '30%' }}>
        <Select
          defaultValue={params?.value}
          disabled={condition?.readonly}
          style={{ width: '200px' }}
        >
          <Option value={'1'}> {'='} </Option>
          <Option value={'2'}>{'>'} </Option>
          <Option value={'3'}> {'<'}</Option>
        </Select>
      </div>
      <div>
        <Select
          defaultValue={params?.value}
          disabled={result?.readonly}
          style={{ width: '200px' }}
        >
          <Option value={'1'}> 1 </Option>
          <Option value={'2'}>2 </Option>
          <Option value={'3'}> 3</Option>
        </Select>
      </div>
      <div onClick={handleDelItem}>🗑</div>
    </div>
  );
});

export default RuleItem;
interface IRuleItemProps {
  index?: string;
  handleDel?: (key: string) => void;
  params?: IPrams;
  condition?: IPrams;
  result?: IPrams;
}

interface IPrams {
  readonly?: boolean;
  value?: string;
}
