"use client"
import React from 'react';
import styled from '@emotion/styled';
import { FiHome, FiSearch, FiPlusSquare, FiHeart, FiUser } from 'react-icons/fi';
import Link from 'next/link';

const MenuBarContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  height: 60px;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
`;

const MenuIcon = styled.div`
  font-size: 24px;
  color: #555;
`;

const MenuBar = () => {
  return (
    <MenuBarContainer>
        <Link href='/'>
        <MenuIcon>
            <FiHome />
        </MenuIcon>
        </Link>

        <Link href='/search'>
        <MenuIcon>
            <FiSearch />
        </MenuIcon>
        </Link>

        <Link href='/plusSquare'>
            <MenuIcon>
                <FiPlusSquare />
            </MenuIcon>
        </Link>

        <Link href='/heart'>
            <MenuIcon>
                <FiHeart />
            </MenuIcon>
        </Link>

        <Link href='/user'>
            <MenuIcon>
                <FiUser />
            </MenuIcon>
        </Link>
    </MenuBarContainer>
  );
};

export default MenuBar;