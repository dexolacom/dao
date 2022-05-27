/* eslint-disable react/prop-types */
// @ts-nocheck
import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { TYPE } from '../../theme'

// Pending,   0 ProposalStatusPending
// Active,    1 ProposalStatusActive
// Canceled,  2 ProposalStatusCancelled
// Defeated,  3 ProposalStatusDefeated
// Succeeded, 4 ProposalStatusActive
// Executed   5 ProposalStatusDefeated

export const ProposalStatus = ({ status }) => {
  const { t } = useTranslation()
  switch (+status) {
    case 0:
      return (
        <ProposalStatusPending>
          <TYPE.main fontWeight={600} fontSize={13} color={'inherit'}>
            {t('voting.pending')}
          </TYPE.main>
        </ProposalStatusPending>
      )
    case 1:
      return (
        <ProposalStatusActive>
          <TYPE.main fontWeight={600} fontSize={13} color={'inherit'}>
            {t('voting.active')}
          </TYPE.main>
        </ProposalStatusActive>
      )
    case 2:
      return (
        <ProposalStatusCancelled>
          <TYPE.main fontWeight={600} fontSize={13} color={'inherit'}>
            {t('voting.canceled')}
          </TYPE.main>
        </ProposalStatusCancelled>
      )
    case 3:
      return (
        <ProposalStatusDefeated>
          <TYPE.main fontWeight={600} fontSize={13} color={'inherit'}>
            {t('voting.defeated')}
          </TYPE.main>
        </ProposalStatusDefeated>
      )
    case 4:
      return (
        <ProposalStatusActive>
          <TYPE.main fontWeight={600} fontSize={13} color={'inherit'}>
            {t('voting.succeded')}
          </TYPE.main>
        </ProposalStatusActive>
      )
    case 5:
      return (
        <ProposalStatusExecuted>
          <TYPE.main fontWeight={600} fontSize={13} color={'inherit'}>
            {t('voting.executed')}
          </TYPE.main>
        </ProposalStatusExecuted>
      )

    default:
      return (
        <ProposalStatusExecuted>
          <TYPE.main fontWeight={600} fontSize={13} color={'inherit'}>
            {t('voting.executed')}
          </TYPE.main>
        </ProposalStatusExecuted>
      )
  }
}

export const ProposalStatusPending = styled.div`
  width: 93px;
  height: 24px;
  color: #bbbbbb;
  background: #2d2d2d;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ProposalStatusActive = styled.div`
  width: 93px;
  height: 24px;
  color: #3dd598;
  background: #2d2d2d;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ProposalStatusCancelled = styled.div`
  width: 93px;
  height: 24px;
  color: #ffb800;
  background: #2d2d2d;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ProposalStatusDefeated = styled.div`
  width: 93px;
  height: 24px;
  color: #fe3c00;
  background: #2d2d2d;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ProposalStatusExecuted = styled.div`
  width: 93px;
  height: 24px;
  color: #bbbbbb;
  background: #2d2d2d;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`
