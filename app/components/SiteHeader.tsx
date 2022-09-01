import { faPlus, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { Form, Link } from "@remix-run/react";
import { useUser } from "~/utils";
import { MaxWidth, CollapsingButton } from ".";

export function SiteHeader() {
  const user = useUser()
  return (
    <header className="bg-white p-4 text-text border-b border-component-background-darken">
      <MaxWidth>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">
            <Link to="/" prefetch="intent">{user.email}'s Clients</Link>
          </h1>

          <div className="flex gap-1">
            <Link to="/clients/new" prefetch="intent">
              <CollapsingButton
                icon={faPlus}
                type="submit" kind="primary" isRounded
              >
                New Client
              </CollapsingButton>
            </Link>
            <Link to="/user">
              <CollapsingButton
                icon={faUser}
                type="submit" kind="secondary" isRounded
              >
                User Details
              </CollapsingButton>
            </Link>
            <Form action="/logout" method="post">
              <CollapsingButton
                icon={faSignOut}
                type="submit" isRounded
              >
                Logout
              </CollapsingButton>
            </Form>
          </div>
        </div>
      </MaxWidth>
    </header>
  )
}