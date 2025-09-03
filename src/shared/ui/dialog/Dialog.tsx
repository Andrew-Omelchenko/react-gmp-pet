import React from 'react';
import { Portal } from 'react-portal';
import { FocusTrap } from 'focus-trap-react';
import styles from './Dialog.module.css';

export type DialogProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
};

export default function Dialog({ title, children, onClose }: DialogProps) {
  const titleId = React.useId();

  const containerRef = React.useRef<HTMLDivElement>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);

  const [trapActive, setTrapActive] = React.useState(false);

  React.useLayoutEffect(() => {
    setTrapActive(true);
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKey);

    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <Portal>
      <FocusTrap
        active={trapActive}
        focusTrapOptions={{
          initialFocus: () => closeBtnRef.current ?? containerRef.current!,
          fallbackFocus: () => containerRef.current ?? document.body,
          tabbableOptions: { displayCheck: 'none' },
        }}
      >
        <div className={styles.overlay} data-testid="dialog-overlay">
          <div
            ref={containerRef}
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
          >
            <header className={styles.header}>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
              <button
                ref={closeBtnRef}
                type="button"
                aria-label="Close dialog"
                className={styles.closeButton}
                onClick={onClose}
              >
                ×
              </button>
            </header>
            <div className={styles.body}>{children}</div>
          </div>
        </div>
      </FocusTrap>
    </Portal>
  );
}
