// Copyright (c) 2017 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as React from 'react';
import { Button, Modal, Table } from 'antd';

import keyboardMappings from '../keyboard-mappings';
import track from './KeyboardShortcutsHelp.track';

import './KeyboardShortcutsHelp.css';

type Props = {
  className: string;
};

type DataRecord = {
  key: string;
  kbds: React.JSX.Element;
  description: string;
};

const { Column } = Table;

const SYMBOL_CONV: Record<string, string> = {
  up: '↑',
  right: '→',
  down: '↓',
  left: '←',
  shift: '⇧',
};

const ODD_ROW_CLASS = 'KeyboardShortcutsHelp--oddRow';

function convertKeys(keyConfig: string | string[]): string[][] {
  const config = Array.isArray(keyConfig) ? keyConfig : [keyConfig];
  return config.map(str => str.split('+').map(part => SYMBOL_CONV[part] || part.toUpperCase()));
}

const padLeft = (text: string) => <span className="ub-pl4">{text}</span>;
const padRight = (text: string) => <span className="ub-pr4">{text}</span>;
const getRowClass = (_: DataRecord, index: number) => (index % 2 > 0 ? ODD_ROW_CLASS : '');

let kbdTable: React.ReactNode | null = null;

function getHelpModal() {
  if (kbdTable) {
    return kbdTable;
  }
  const data: DataRecord[] = [];
  Object.keys(keyboardMappings).forEach(handle => {
    const { binding, label } = keyboardMappings[handle];
    const keyConfigs = convertKeys(binding);
    data.push(
      ...keyConfigs.map(config => ({
        key: String(config),
        kbds: <kbd>{config.join(' ')}</kbd>,
        description: label,
      }))
    );
  });

  kbdTable = (
    <Table
      className="KeyboardShortcutsHelp--table u-simple-scrollbars"
      dataSource={data}
      size="middle"
      pagination={false}
      showHeader={false}
      rowClassName={getRowClass}
    >
      <Column title="Description" dataIndex="description" key="description" render={padLeft} />
      <Column title="Key(s)" dataIndex="kbds" key="kbds" align="right" render={padRight} />
    </Table>
  );
  return kbdTable;
}

export default function KeyboardShortcutsHelp({ className }: Props) {
  const [visible, setVisible] = React.useState(false);

  const onCtaClicked = () => {
    track();
    setVisible(true);
  };

  const onCloserClicked = () => setVisible(false);

  return (
    <React.Fragment>
      <Button className={className} htmlType="button" onClick={onCtaClicked}>
        <span className="KeyboardShortcutsHelp--cta">⌘</span>
      </Button>
      <Modal
        title="Keyboard Shortcuts"
        open={visible}
        onOk={onCloserClicked}
        onCancel={onCloserClicked}
        cancelButtonProps={{ style: { display: 'none' } }}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        {getHelpModal()}
      </Modal>
    </React.Fragment>
  );
}
