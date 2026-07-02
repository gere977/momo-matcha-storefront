import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="border-t border-matcha-kraft/50 bg-matcha-kraft/20 w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-8 xsmall:flex-row items-start justify-between py-20">
          <div>
            <LocalizedClientLink
              href="/"
              className="font-heading text-4xl text-matcha hover:text-matcha"
            >
              Momo Matcha
            </LocalizedClientLink>
            <Text className="txt-small text-matcha-text/70 mt-2">
              Rituálék a lassú élethez.
            </Text>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus text-matcha-text">
                  Kategóriák
                </span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return
                    }

                    const children =
                      c.category_children?.map((child) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null

                    return (
                      <li
                        className="flex flex-col gap-2 text-ui-fg-subtle txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx(
                            "hover:text-ui-fg-base",
                            children && "txt-small-plus"
                          )}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children && (
                          <ul className="grid grid-cols-1 ml-3 gap-2">
                            {children &&
                              children.map((child) => (
                                <li key={child.id}>
                                  <LocalizedClientLink
                                    className="hover:text-ui-fg-base"
                                    href={`/categories/${child.handle}`}
                                    data-testid="category-link"
                                  >
                                    {child.name}
                                  </LocalizedClientLink>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus text-matcha-text">
                  Kollekciók
                </span>
                <ul
                  className={clx(
                    "grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small",
                    {
                      "grid-cols-2": (collections?.length || 0) > 3,
                    }
                  )}
                >
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-ui-fg-base"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus text-matcha-text">Momo Matcha</span>
              <ul className="grid grid-cols-1 gap-y-2 text-matcha-text/70 txt-small">
                <li>
                  <LocalizedClientLink href="/pages/about" className="hover:text-matcha">
                    Rólunk
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/pages/aszf" className="hover:text-matcha">
                    ÁSZF
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/pages/shipping" className="hover:text-matcha">
                    Szállítás
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/pages/refunds" className="hover:text-matcha">
                    Visszaküldés
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-full mb-16 justify-between text-matcha-text/60">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} Momo Matcha. Minden jog fenntartva.
          </Text>
        </div>
      </div>
    </footer>
  )
}
