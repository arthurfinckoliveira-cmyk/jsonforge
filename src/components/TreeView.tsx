import type { JsonValue } from '../lib/jsonEngine';
import { TreeNode } from './TreeNode';

interface TreeViewProps {
  value: JsonValue;
}

export function TreeView({ value }: TreeViewProps) {
  return (
    <ul className="tree tree-root-list">
      <TreeNode name={null} value={value} />
    </ul>
  );
}
