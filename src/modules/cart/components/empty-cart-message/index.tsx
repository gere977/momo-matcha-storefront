import { Heading, Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  return (
    <div className="py-48 px-2 flex flex-col justify-center items-start" data-testid="empty-cart-message">
      <Heading
        level="h1"
        className="flex flex-row font-heading text-5xl text-matcha-accent gap-x-2 items-baseline"
      >
        Kosár
      </Heading>
      <Text className="text-base-regular text-matcha-text/70 mt-4 mb-6 max-w-[32rem]">
        Még nincs semmi a kosaradban. Nézz körül a matcháink között!
      </Text>
      <div>
        <InteractiveLink href="/store">Termékek böngészése</InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
