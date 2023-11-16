import styled from 'styled-components'

export const Tab = styled.div<{ active: boolean }>`
  padding: 4px 0;
  color: ${({ active, theme }) => (active ? theme.primary : theme.subText)};
  font-weight: 500;
  cursor: pointer;
  :hover {
    color: ${props => props.theme.primary};
  }
`

export const TabRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    gap: 1rem;
    width: 100%;
    flex-direction: column;
  `}
`