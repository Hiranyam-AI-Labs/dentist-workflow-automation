# Mobile Application Standards

> **Authoritative Engineering Standard across all Hiranyam AI Mobile Projects (Android Native, iOS Native & Flutter).**
> **Standard Heritage**: Established in DG Online / DG Comp mobile applications and mandated across all client & tenant codebases.

---

## 1. Android Development (Kotlin)
- Modern Android SDK (minSdk 24+, targetSdk 34+) with Kotlin DSL (`build.gradle.kts`).
- MVVM / MVI Clean Architecture separation with Hilt / Koin dependency injection.
- Offline-first caching with Room DB, Flow reactive streams, and background WorkManager synchronization.
- Android 13/14 Predictive Back Gesture support via `OnBackPressedCallback` and `OnBackInvokedDispatcher`.

---

## 2. Cross-Platform Development (Flutter / Dart)
- Flutter SDK (3.x stable) with Dart sound null-safety.
- Feature-driven modular architecture (`core/`, `features/`, `models/`, `services/`).
- Reactive state management with clean separation of presentation and business logic.
- Responsive layout architecture supporting multiple mobile screen form factors (zero overflow protocol).
- Universal Code Documentation Mandate: 100% of methods, classes, constructors, and routines documented with explanatory docstrings and minute-level comments.

---

## 3. Universal Mobile Navigation, Hardware Back-Button Handling & Exit Protocol Standard (DG Comp Heritage)

### 3.1 The Problem & Core Motivation
In mobile applications featuring bottom navigation bars or multi-tab interfaces (e.g. Home, Schedule, Venue Floor Map, Directory, Profile), the default operating system back action often pops the root Activity or terminates the Flutter host, causing users to abruptly exit the application when they simply intended to return to their previously viewed screen or dismiss a selection.

### 3.2 The Four Mandatory Architectural Rules

#### Rule 1: Multi-Tab History Back-Stack (To-and-Fro Navigation Sequence)
1. **Never Exit Abruptly from Internal Tabs**: Tapping the hardware back button or performing a predictive back gesture from any non-root tab (such as Schedule, 4-Floor Plan, Networking, or Profile) must **NEVER** exit the application.
2. **Reverse Chronological History**: The application must maintain an internal navigation back-stack (`_tabHistory`) tracking visited tabs in chronological order.
3. **To-and-Fro Traversal**: Pressing back must pop the top of the history stack and return to the immediately preceding tab (e.g. Venue Map -> Schedule -> Home).
4. **Duplicate & Loop Prevention**: If a user switches to a tab that already exists in the history stack, previous occurrences must be removed and re-appended to the top (LRU stack behavior) to prevent infinite back-press ping-pong loops.
5. **Root Fallback**: If the tab history is cleared or contains a single non-root entry, pressing back must safely navigate to the Home tab (index 0).

#### Rule 2: In-Screen Sub-State Dismissal Priority
Before popping tab history, the back handler must check for and dismiss any active in-screen contextual sub-states:
1. **Selected Map Pins / Stalls**: On interactive venue maps, if a booth or location detail sheet is open (`selectedLocation != null`), pressing back must deselect the pin and dismiss the detail card first, keeping the user on the floor map.
2. **Active Search Queries**: If a search bar has active text, pressing back should clear the search filter.
3. **Open Dialogs / Modals / Bottom Sheets**: Any active overlay route on the Navigator stack must be popped first before tab history or exit confirmation is evaluated.

#### Rule 3: Root Screen Exit Confirmation Prompt
1. **Prompt Required on Root**: When the user is on the root Home screen (index 0) — or on the root unauthenticated Login screen — and presses the hardware back button with no active modal routes, the app must **NOT** exit immediately.
2. **Standard Exit Modal**: The app must present an explicit, styled modal dialog:
   - **Title**: `Exit <App Name>?` (e.g. `Exit BBNG Parivartan 2027?`)
   - **Body**: `Are you sure you want to exit the application? Your active session and data will be preserved when you return.`
   - **Actions**:
     - `Cancel` (Dismisses modal, keeps user in app)
     - `Exit App` (Explicit confirmation, cleanly terminates the app)
3. **Graceful OS Delegation**: Only upon clicking `Exit App` will the application invoke the platform exit bridge (`SystemNavigator.pop()` in Flutter, `finishAffinity()` in Android).

#### Rule 4: Flutter Reference Architecture (`PopScope` & `IndexedStack`)

```dart
// Standard MainTabsScreen Architecture Pattern
class _MainTabsScreenState extends State<MainTabsScreen> {
  int _currentIndex = 0;
  final List<int> _tabHistory = [0];

  void _onNavigateTab(int index) {
    if (_currentIndex == index) return;
    setState(() {
      if (index == 0) {
        _tabHistory.clear();
        _tabHistory.add(0);
      } else {
        _tabHistory.remove(index);
        _tabHistory.add(index);
      }
      _currentIndex = index;
    });
  }

  Future<void> _handleBackNavigation(bool didPop, dynamic result) async {
    if (didPop) return;

    // 1. Check Navigator for active dialogs
    final navigator = Navigator.of(context);
    if (navigator.canPop()) {
      navigator.pop();
      return;
    }

    // 2. In-Screen Sub-State Handling (e.g. Venue Map pin selection)
    if (_currentIndex == 2) {
      if (venueMapService.selectedLocation != null) {
        venueMapService.selectLocation(null);
        return;
      }
    }

    // 3. Multi-Tab History Back-Stack
    if (_tabHistory.length > 1) {
      setState(() {
        _tabHistory.removeLast();
        _currentIndex = _tabHistory.last;
      });
      return;
    }

    // 4. Fallback to Home if on non-root tab
    if (_currentIndex != 0) {
      setState(() {
        _currentIndex = 0;
        _tabHistory.clear();
        _tabHistory.add(0);
      });
      return;
    }

    // 5. Root Screen Exit Confirmation Prompt
    final bool shouldExit = await ExitConfirmationDialog.show(context);
    if (shouldExit) {
      await SystemNavigator.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: _handleBackNavigation,
      child: Scaffold(
        body: IndexedStack(
          index: _currentIndex,
          children: _screens,
        ),
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: _onNavigateTab,
          items: const [ ... ],
        ),
      ),
    );
  }
}
```

---

## 4. Universal Brand Endorsement Footer Mandate ("Powered by Hiranyam AI Labs") (P0 Rule 16)

Every mobile application engineered under Hiranyam AI Labs (Flutter, Android Native, iOS Native) MUST feature a permanent, ubiquitous brand endorsement strip docked at the bottom of every viewport:

1. **Ubiquitous Display**: Visible continuously across all application states (unauthenticated login, authenticated dashboard, forms, reports, calculators, and modals).
2. **Visual Hierarchy**:
   - Primary copy: `"Powered by Hiranyam AI Labs"`
   - Icon: Glowing sparkle icon (`Icons.auto_awesome`) in Saffron Orange (`#EA892F`).
   - Text styling: `FontWeight.w600`, 11.5sp, Royal Indigo (`#393185`), letter spacing 0.35.
   - Container: Crisp elevated white surface with top border (`#E2E0EE`, 1px) and ambient upward elevation.
3. **Root Ingestion**: In Flutter, inject via `MaterialApp.builder` so child screens automatically inherit the docked footer without redundant code in individual views.
4. **Edge-to-Edge Safe Area**: Compute `MediaQuery.of(context).padding.bottom` dynamically to avoid clipping against gesture bars and navigation pills.
5. **Reference**: See full specification in `standards/brand-endorsement-standards.md`.

---

## 5. Universal Compliance Checklist
Before any mobile application build or release is approved across Hiranyam AI projects:
- [ ] Hardware back button tested on all non-root tabs (Schedule, Map, Directory, Profile) — verifies return to previous tabs without exiting.
- [ ] Map stall/pin selection dismisses on back press without changing tabs.
- [ ] Root Home tab displays exit confirmation dialog on back press.
- [ ] Cancel button in exit modal dismisses cleanly and keeps user on Home screen.
- [ ] Exit App button cleanly closes the application via `SystemNavigator.pop()`.
- [ ] Unauthenticated root (Login screen) is similarly protected with exit confirmation dialog.
- [ ] Persistent brand endorsement footer ("Powered by Hiranyam AI Labs") is verified visible on all screens.
- [ ] Automated widget tests verify presence of sponsor badge (`HiranyamSponsorBadge`).
- [ ] **Mandatory Wireless Debugging**: Mobile device connected via ADB wireless debugging (`adb connect <device_ip>:<port>`).
- [ ] **Screen-by-Screen Traversal**: App verified opening on the physical phone screen with 100% of screens navigated.
- [ ] **Action-by-Action Verification**: Every action performed on every screen (all tabs, buttons, forms, modals, quizzes, payments, and back buttons).
- [ ] Real physical display screenshots captured and archived as unassailable verification proof.

