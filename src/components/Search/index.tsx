import { t } from '@lingui/macro'
import React from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'

import { ButtonEmpty } from 'components/Button'
import SearchIcon from 'components/Icons/Search'
import useTheme from 'hooks/useTheme'

export const Container = styled.div`
  z-index: 1;
  position: relative;
  background-color: ${({ theme }) => theme.background};
  border-radius: 999px;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`

export const Wrapper = styled.div<{ minWidth?: string }>`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 6px 12px;
  border-radius: 40px;
  width: 100%;
  min-width: ${({ minWidth }) => minWidth || '360px'};
  box-sizing: border-box;
  @media screen and (max-width: 500px) {
    box-shadow: none;
    min-width: 100%;
  }
`
export const Input = styled.input`
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  width: 100%;
  color: ${({ theme }) => theme.text};
  font-size: 12px;

  ::placeholder {
    color: ${({ theme }) => theme.border};
    font-size: 12px;
  }
`

interface SearchProps {
  searchValue: string
  onSearch: (newSearchValue: string) => void
  placeholder?: string
  allowClear?: boolean
  minWidth?: string
  style?: React.CSSProperties
}

export const Search = ({ searchValue, onSearch, placeholder, minWidth, style }: SearchProps) => {
  const theme = useTheme()
  return (
    <Container style={style}>
      <Wrapper minWidth={minWidth}>
        <Input
          type="text"
          placeholder={placeholder || t`Search by pool address`}
          value={searchValue}
          onChange={e => {
            onSearch(e.target.value)
          }}
        />
        {searchValue && (
          <ButtonEmpty onClick={() => onSearch('')} style={{ padding: '2px 4px', width: 'max-content' }}>
            <X color={theme.subText} size={14} style={{ minWidth: '14px' }} />
          </ButtonEmpty>
        )}
        <SearchIcon color={theme.border} />
      </Wrapper>
    </Container>
  )
}

export default Search
