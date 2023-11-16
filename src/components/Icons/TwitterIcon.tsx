import React from 'react'

const TwitterIcon = ({ width, height, color }: { width?: number; height?: number; color?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width || 14} height={height || 12} viewBox="0 0 14 12">
      <g fill="none" fillRule="evenodd">
        <g>
          <g>
            <g>
              <g>
                <g>
                  <path
                    d="M0 0L16 0 16 16 0 16z"
                    transform="translate(-154 -741) translate(19 734) translate(128) translate(6 5) rotate(-90 8 8)"
                  />
                  <path
                    stroke={color || '#1B95CD'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12.8 6.233c0 4.2-2.4 7.2-6.6 7.2-2.4 0-3.362-1.252-4.2-2.4m0 0c.02-.003 1.8-.6 1.8-.6-2.004-2.026-2.156-5.026-.6-7.2.738 1.373 2.116 2.64 3.6 3 .057-1.733 1.233-3 3-3 1.203 0 1.911.459 2.4 1.2H14l-1.2 1.8"
                    transform="translate(-154 -741) translate(19 734) translate(128) translate(6 5)"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}


export  function TwitterNew({ size, color }: { size?: number | string; color?: string }) {
  return (
   <svg viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet" width={size || '36'} height={size || '36'}>
    <path fill={color || '#A7B6BD'} d="M419.6 168.6c-11.7 5.2-24.2 8.7-37.4 10.2 13.4-8.1 23.8-20.8 28.6-36 -12.6 7.5-26.5 12.9-41.3 15.8 -11.9-12.6-28.8-20.6-47.5-20.6 -42 0-72.9 39.2-63.4 79.9 -54.1-2.7-102.1-28.6-134.2-68 -17 29.2-8.8 67.5 20.1 86.9 -10.7-0.3-20.7-3.3-29.5-8.1 -0.7 30.2 20.9 58.4 52.2 64.6 -9.2 2.5-19.2 3.1-29.4 1.1 8.3 25.9 32.3 44.7 60.8 45.2 -27.4 21.4-61.8 31-96.4 27 28.8 18.5 63 29.2 99.8 29.2 120.8 0 189.1-102.1 185-193.6C399.9 193.1 410.9 181.7 419.6 168.6z"></path>
   </svg>
  )
}

export default TwitterIcon
