import React from 'react'
import styles from './exampleheader.module.scss'
import styled from 'styled-components'


export default () => (
  <>
    <Wrapper />
    <header className={styles.headerClass} />
  </>
)

const Wrapper = styled.div`
  display: block;
  position: fixed;
  width: 100%;
  height: 80px;
  z-index: 10;
`