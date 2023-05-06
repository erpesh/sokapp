import Link from "next/link";
import {Scope, useScopedI18n} from "../locales";
import {useRouter} from "next/router";

const SETTINGS_PAGES = [
  {name: "Account", path: "/settings", teacherOnly: false},
  {name: "Lessons", path: "/settings/lessons", teacherOnly: true},
]

const SettingsMenu = () => {

  const ts = useScopedI18n("scope.settings" as Scope);

  const router = useRouter();

  return (
    <aside className={"settings-menu"}>
      {SETTINGS_PAGES.map(item => {
        return (
          <div key={item.name} className={"settings-menu-item"}>
            <Link className={router.asPath === item.path ? "settings-menu-item color-theme" : "settings-menu-item"} href={item.path}>{ts(item.name)}</Link>
          </div>
        )
      })}
    </aside>
  );
};

export default SettingsMenu;