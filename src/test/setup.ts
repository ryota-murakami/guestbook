import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// テストでJest DOMマッチャーを使用できるようにする
expect.extend(matchers);

// 各テスト後にクリーンアップ
afterEach(() => {
  cleanup();
}); 