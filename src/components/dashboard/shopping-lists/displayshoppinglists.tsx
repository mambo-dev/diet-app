'use client'
import { ShoppingList } from '@prisma/client'
import React from 'react'

type Props = {
    shoppingLists:ShoppingList[]
}

export default function DisplayShoppingLists({shoppingLists}: Props) {
  return (
    <div>DisplayShoppingLists</div>
  )
}