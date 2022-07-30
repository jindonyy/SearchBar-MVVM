# MV\* 패턴 적용해보기

## MVVM 적용 설계

설명이 추상적으로 느껴지는 부분이 많이 있었다.  
예제를 찾아보았으나, javascript와 관련된 예제가 많이 없고, swift와 안드로이드 예제가 많았다.  
따라서, 애매하게 느껴지는 부분은 **주관적인 해석**을 곁들여 설계하였다.

### [View](https://github.com/jindonyy/SearchBar-MVVM/blob/dony/static/src/views/components/header/search/RecentSearchKeywords.js)

- 화면을 담당, render하고, 이벤트를 통해 사용자의 input을 받는 역할이다.
- ViewModel을 소유하고 있으며, 이벤트로 들어온 input을 ViewModel에게 넘겨준다.
- ViewModel을 관찰하고 있어 ViewModel의 state가 변경되면 새로 render를 한다.

### [ViewModel](https://github.com/jindonyy/SearchBar-MVVM/blob/dony/static/src/viewModels/header/search/RecentSearchKeywordsViewModel.js)

- 말그대로 View 전용 Model로 해석하였다.
- 즉, View를 위한 state를 가지고 있다. Model에서 넘겨받은 state를 View에서 사용할 수 있게 가공하여 넘겨준다.
- Model을 소유하고 있으며, View에서 받은 input을 Model에게 넘겨준다.
- MVC 패턴의 Controller와 비슷한 역할이라고 할수 있다.  
  그러나, 큰 차이점이라면 ViewModel은 View의 존재를 모른다.  
  중간에서 소통하는 역할이였던 controller와 달리 단방향의 흐름으로 진행된다.

### [Model](https://github.com/jindonyy/SearchBar-MVVM/blob/dony/static/src/stores/localstorage.js)

- store의 역할, render에 필요한 데이터를 가져오는 로직을 담당하고 있다.
- 아무것도 소유하고 있지 않다. 따라서, View, ViewModel을 전혀 신경쓰지 않아도 된다.
- 오직 ViewModel에서 넘겨준 value를 토대로 state를 가져오거나 업데이트만 하면 된다. (어떻게 넘겨줄지 신경X)

### 데이터 바인딩

- 데이터 바인딩은 데이터를 제공하는 자와 그 데이터를 사용하는 자를 연결시켜 동기화되도록 하는 방식이다.
- Observer 패턴을 사용하여 비지니스 로직이 변경될 시, UI도 업데이트 되도록 하였다.

  1. Model의 state인 데이터가 업데이트 될 시, ViewModel에게 notify한다.

  ```js
  constructor(key) {
    this.state = this.getState();
    this.observers = new Set();
  }

  // 1. 파라미터로 들어온 구독자(ViewModel)를 추가한다.
  addObserver(observer) {
    this.observers.add(observer);
  }

  // 2. 구독자인 ViewModel에게서 받은 Input이 들어오면, 업데이트한 후 구독자에 알린다.
  observe(newState) {
    newState ? this.setState(newState) : this.removeState();
    this.observers.forEach(observer => {
      observer.notify(this.state);
    });
  }
  ```

  2. 구독하고 있던 Model에게 알림이 오면 가공하여, 자신의 state를 업데이트 한 후 View에게 notify한다.

  ```js
  constructor() {
    this.state = this.convertStoreState();
    this.store.addObserver(this); // 1. Store의 구독자로 자신을 등록한다.
    this.observers = new Set();
  }

  // 2. 파라미터로 들어온 구독자(View)를 추가한다.
  addObserver(observer) {
    this.observers.add(observer);
  }

  // 3. 구독자(View)에게서 input이 넘어오면, Model에게 전달 후 관찰한다.
  observe(value) {
    this.store.observe(value);
  }

  setState() {
    ...
  }

  // 4. Model에게서 받은 새로운 데이터를 자신의 상태로 업데이트한 후, 구독자(View)에게 알린다.
  notify(storeState) {
    this.setState(storeState);
    this.observers.forEach(observer => {
      observer.render(this.state);
    });
  }
  ```

  3. ViewModel에게서 받은 state를 통해 화면을 업데이트 한다.

  ```js
  constructor() {
    this.viewModel = new RecentSearchKeywordsViewModel();
  }

  // 2-1. ViewModel을 관찰 중이다.
  observe(searchValue) {
    this.viewModel.observe(searchValue);
  }

  addAllDeleteButtonEventListener() {
    this.$recentKeywordsWrap.querySelector('.all-delete-button').addEventListener('mousedown', () => {
      this.viewModel.observe(null); // 2. viewModel에게 input을 넘겨준 후, 관찰한다.
      this.$recentKeywordsWrap.classList.remove('active');
    });
  }

  // 3. ViewModel에게서 받은 prop으로 화면을 업데이트 한다.
  render(props = this.viewModel.state) {
    ...
    const recentKeywordsTemplate = props
      .map(
        keyword => `<li>
                      <a href="javascript:;"}"><span>${keyword}</span></a>
                      <button type="button" class="delete-button">삭제</button>
                    </li>`
      )
      .join('');
    this.$recentKeywords.insertAdjacentHTML('afterbegin', recentKeywordsTemplate);
  }

  init() {
    ...
    this.viewModel.addObserver(this); // 1. ViewModel의 구독자로 자신을 등록한다.
  }
  ```

  <br>
  <br>

### 설계도

  <br>
<img width="1000" src="https://user-images.githubusercontent.com/17706346/160886010-8fe80f77-6bb1-41c5-9e31-8287e6f0a52c.png">  
  <br>
  <br>
  <br>

## 고민했던 부분

- **ViewModel이 Model에게 전달해줘야 하나?**  
  ViewModel에서 View에게 데이터를 가공하여 주는 것처럼 Model은 setState만 하도록 가공해서 줘야하나? 고민.  
  👉 그러나 단방향의 흐름이여야 하는데 ViewModel이 Model의 데이터까지 가공해준다면 중간자 역할이 되는 것 같았다.  
  그냥 ViewModel에서 받은걸 토대로 Model이 자신의 데이터 변경방식에 맞게 가공하도록 결정.

- **input을 주는 컴포넌트와 state를 사용하는 컴포넌트가 다르다.**  
  검색 input 창(searchBar)에서 이벤트를 통해 input을 받지만,  
  최근 검색창(RecentSearchKeywords), 자동 완성 창(AutomaticCompletion)이 데이터 바인딩 되야하는 컴포넌트이다.
  동급의 컴포넌트끼리 소유하고 있지 않고, 둘을 연결시키는 방식을 고민하였다.  
  👉 모든 컴포넌트를 소유하고 있는 header에서 필요한 컴포넌트를 넘겨주는 방식으로 결정  
  ViewModel은 데이터 바인딩 되야하는 컴포넌트(RecentSearchKeywords, AutomaticCompletion)가 가지고 있고, 그 컴포넌트를 넘겨받은 검색 창(searchBar)에서 input을 넘겨준다.
- **store의 모듈화**  
  localStorage와 데이터 fetch는 자주 쓰이는 부분인데 store를 따로 만들면 중복코드가 많을거라 생각하여 모듈화를 시도해보았다.
  - localStorage는 key를 넘겨받아 해당 key에 맞는 데이터를 가져올 수 있도록 설계
  - fetch는 GET, POST등의 방식에 따라 setState가 다르게 설계되야 한다.  
     아직 다른 method 방식을 제대로 알지 못하여 GET 방식에서만 사용할 수 있도록 설계하였다.  
    <br>
    <br>

## 구현하며 느낀 점

- MVC처럼 중재자가 아니라 단뱡향으로 진행되어 View와 Model이 controller에서 의존적이던 부분이 해결된 것 같다.
- controller의 역할을 ViewModel과 observer 패턴, 큰 컴포넌트에서 작은 컴포넌트를 조합하는 방식 등으로 역할을 나누어 역할이 분배되어 좋았다.
- searchBar가 두개의 컴포넌트와 소통하다보니 비대해져 고민이다.
- 구현에 목적을 두어 설계하였으나 단계가 늘어나고 역할이 분배되다보니 설계가 어려웠다.  
  <br>
  <br>

## Reference

[Heechan - iOS 개발 — MVVM 패턴이란? UIKit의 MVC와의 비교](https://medium.com/hcleedev/ios-swiftui%EC%9D%98-mvvm-%ED%8C%A8%ED%84%B4%EA%B3%BC-mvc%EC%99%80%EC%9D%98-%EB%B9%84%EA%B5%90-8662c96353cc)  
[삵 (sarc.io) - MVVM 패턴이란?](https://sarc.io/index.php/development/1332-mvvm)  
[yujeong136.log - 디자인 패턴(2) \_ MVVM 정리](https://velog.io/@yujeong136/%EB%94%94%EC%9E%90%EC%9D%B8-%ED%8C%A8%ED%84%B42-MVVM-%EC%A0%95%EB%A6%AC)  
[EDUCATE - MVVM 패턴](https://www.educative.io/collection/page/5429798910296064/5725579815944192/5161641743220736)  
[개발자 황준일 - MVVM System 만들기](https://junilhwang.github.io/TIL/CodeSpitz/Object-Oriented-Javascript/02-MVVM/#mvc%E1%84%8B%E1%85%AA-mvp%E1%84%8B%E1%85%B4-%E1%84%86%E1%85%AE%E1%86%AB%E1%84%8C%E1%85%A6%E1%84%8C%E1%85%A5%E1%86%B7)
