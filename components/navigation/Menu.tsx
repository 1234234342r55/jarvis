import Link from 'next/link';
import { useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import * as React from 'react'

export type IMenu = {
  id: number;
  title: string;
  url: string;
  dropdown?: boolean;
  items?: IMenu[];
};

type MenuProps = {
  list: IMenu[];
};

const Menu = ({ list }: MenuProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <MotionConfig transition={{ bounce: 0, type: 'tween' }}>
      <nav className={'relative'}>
        <ul className={'flex items-center gap-4'}>
          {list?.map((item) => {
            return (
              <li key={item.id} className={'relative'}>
                <Link
                  className={`
                    relative flex items-center justify-center rounded px-10 py-4 transition-all duration-300 text-white
                    font-[family-name:var(--font-cormorant)] text-lg font-semibold tracking-[0.4em] uppercase
                    hover:text-[#E85D04] hover:bg-black/20 backdrop-blur-sm
                    ${hovered === item?.id ? 'text-[#E85D04] bg-black/20' : ''}
                  `}
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered(null)}
                  href={item?.url}
                >
                  {item?.title}
                </Link>
                {hovered === item?.id && !item?.dropdown && (
                  <motion.div
                    layout
                    layoutId={`cursor`}
                    className={'absolute h-0.5 w-full bg-[#E85D04]'}
                  />
                )}
                {item?.dropdown && hovered === item?.id && (
                  <div
                    className='absolute left-0 top-full'
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <motion.div
                      layout
                      transition={{ bounce: 0 }}
                      initial={{ y: 10 }}
                      animate={{ y: 0 }}
                      exit={{ y: 10 }}
                      style={{
                        borderRadius: '8px',
                      }}
                      className='mt-4 flex w-64 flex-col rounded bg-background border'
                      layoutId={'cursor'}
                    >
                      {item?.items?.map((nav) => {
                        return (
                          <motion.a
                            key={`link-${nav?.id}`}
                            href={`${nav?.url}`}
                            className={'w-full p-4 hover:bg-muted'}
                          >
                            {nav?.title}
                          </motion.a>
                        );
                      })}
                    </motion.div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </MotionConfig>
  );
};

export default Menu;
