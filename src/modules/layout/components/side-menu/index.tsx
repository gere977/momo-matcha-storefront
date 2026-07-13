"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

const SideMenuItems = [
  { label: "Főoldal", href: "/" },
  { label: "Matcha Teák", href: "/collections/matcha" },
  { label: "Kiegészítők", href: "/categories/kiegeszitok" },
  { label: "Minden termék", href: "/store" },
  { label: "Fiókom", href: "/account" },
  { label: "Kosár", href: "/cart" },
]

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center gap-x-2 font-semibold transition-colors duration-200 focus:outline-none text-matcha-text hover:text-matcha-accent"
                >
                  <span className="flex flex-col gap-[3.5px]">
                    <span className="block w-5 h-[2px] rounded-full bg-current" />
                    <span className="block w-5 h-[2px] rounded-full bg-current" />
                    <span className="block w-3.5 h-[2px] rounded-full bg-current" />
                  </span>
                  Menü
                </Popover.Button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition-opacity ease-out-quart duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-out-quart duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  className="fixed inset-0 z-[50] bg-matcha-dark/25 backdrop-blur-sm pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              </Transition>

              <Transition
                show={open}
                as={Fragment}
                enter="transition-transform ease-drawer duration-300"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition-transform ease-drawer duration-200"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <PopoverPanel className="flex flex-col fixed top-0 left-0 w-full sm:w-[380px] h-screen z-[51] text-matcha-text">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-matcha-cream border-r border-matcha-kraft/60 justify-between p-8 shadow-2xl"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-10">
                        <img
                          src="/images/logo.jpg"
                          alt="Momo Matcha"
                          className="h-12 w-auto"
                          style={{ mixBlendMode: "multiply" }}
                        />
                        <button
                          data-testid="close-menu-button"
                          onClick={close}
                          className="text-matcha-text/50 hover:text-matcha-accent transition-colors"
                        >
                          <XMark />
                        </button>
                      </div>

                      <ul className="flex flex-col" data-stagger>
                        {SideMenuItems.map((item) => (
                          <li key={item.label}>
                            <LocalizedClientLink
                              href={item.href}
                              onClick={close}
                              data-testid={`${item.label.toLowerCase()}-link`}
                              className="group flex items-center justify-between font-heading text-2xl py-2.5 text-matcha-dark hover:text-matcha-accent transition-colors"
                            >
                              {item.label}
                              <ArrowRightMini className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-[opacity,transform] duration-200 ease-out-quart text-matcha-accent" />
                            </LocalizedClientLink>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-y-5">
                      {!!locales?.length && (
                        <div
                          className="flex justify-between"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}
                      <div
                        className="flex justify-between"
                        onMouseEnter={countryToggleState.open}
                        onMouseLeave={countryToggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150",
                            countryToggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      <Text className="txt-compact-small text-matcha-text/50">
                        © {new Date().getFullYear()} Momo Matcha
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
