<!-- 
  파일: EnhancedComparisonDemo.vue 
  왼쪽: 재파싱·재렌더링 방식 / 오른쪽: streaming-markdown 방식 비교 데모
  - 복잡한 차트, 표, 이미지 추가 버전
-->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { marked } from 'marked'; // marked 라이브러리 사용
import * as smd from 'streaming-markdown'; // streaming-markdown 라이브러리 사용

// 스트리밍될 콘텐츠를 저장할 ref
const streamingContent = ref('');
const rerenderElement = ref(null); // 재파싱·재렌더링 방식용
const streamingElement = ref(null); // streaming-markdown 방식용
const isStreaming = ref(false);
const progress = ref(0);

// 스트리밍 인터벌 레퍼런스
let streamInterval = null;

// streaming-markdown 파서 인스턴스
let parser = null;

// LLM 응답을 시뮬레이션하기 위한 마크다운 문자열
const simulatedLLMResponse= `# 마크다운 렌더링 방식 비교 강화 데모

안녕하세요! 이것은 **토큰 단위 지연 전송**과 *부분 DOM 패치*를 시뮬레이션하는 강화된 예제입니다.

## 기본 텍스트 렌더링 비교

일반 텍스트와 **굵은 텍스트**와 *기울임 텍스트*와 ~~취소선~~과 \`인라인 코드\`와 [링크](https://example.com)가 섞여 있을 때 두 방식의 차이를 관찰하세요.

## 복잡한 표(Table) 렌더링 비교

### 기본 표 렌더링

| 방식 | 장점 | 단점 | 효율성 | 구현 난이도 |
|------|------|------|--------|------------|
| 재파싱·재렌더링 | 구현 간단 | 성능 저하, 깜빡임 | 낮음 | 쉬움 |
| streaming-markdown | 부드러운 렌더링, 효율적 | 구현 복잡 | 높음 | 어려움 |
| 하이브리드 | 균형잡힌 성능 | 추가 최적화 필요 | 중간 | 중간 |
| 사용자 정의 렌더러 | 유연성 높음 | 개발 비용 높음 | 가변적 | 매우 어려움 |

### 복잡한 중첩 표 렌더링

| 상위 카테고리 | 하위 카테고리 | 세부 항목 | 설명 |
|--------------|--------------|-----------|------|
| 프론트엔드 | 렌더링 엔진 | **DOM 기반** | 웹 브라우저의 기본 렌더링 방식 |
|  |  | **가상 DOM** | React, Vue 등에서 사용하는 최적화된 렌더링 |
|  | UI 프레임워크 | *React* | 컴포넌트 기반의 선언적 UI 라이브러리 |
|  |  | *Vue* | 점진적으로 적용 가능한 프론트엔드 프레임워크 |
|  |  | *Angular* | 완전한 프론트엔드 솔루션 |
| 백엔드 | 서버 | **Node.js** | 자바스크립트 런타임 환경 |
|  |  | **Django** | 파이썬 기반 웹 프레임워크 |
|  | 데이터베이스 | *SQL* | 관계형 데이터베이스 |
|  |  | *NoSQL* | 비관계형 데이터베이스 |

## 이미지 렌더링 비교

### 단일 이미지 렌더링

이미지 렌더링 속도와 깜빡임을 관찰해보세요:

![첫 번째 테스트 이미지](https://picsum.photos/400/200)

### 다중 이미지 렌더링

여러 이미지가 순차적으로 나타날 때의 차이점을 관찰해보세요:

![두 번째 테스트 이미지](https://picsum.photos/400/150?random=1)

![세 번째 테스트 이미지](https://picsum.photos/400/180?random=2)

![네 번째 테스트 이미지](https://picsum.photos/400/220?random=3)

## 복잡한 차트 (ASCII 아트)

### 막대 차트
\`\`\`
재파싱·재렌더링 방식 성능    [██████████████░░░░░░░░░░] 60%
streaming-markdown 방식 성능 [████████████████████████] 100%
하이브리드 방식 성능         [██████████████████░░░░░░] 80%
사용자 정의 렌더러 성능      [███████████████████░░░░░] 85%
\`\`\`



## 복잡한 중첩 리스트

1. 마크다운 렌더링 기본 원리
   - 파싱 단계
     - 토큰화(Tokenization)
       - 마크다운 텍스트를 개별 토큰으로 분할
       - 각 토큰은 특정 마크다운 요소를 나타냄
     - 구문 분석(Parsing)
       - 토큰 간의 관계 분석
       - AST(Abstract Syntax Tree) 구성
   - 렌더링 단계
     - HTML 변환
       - AST를 HTML 요소로 변환
     - DOM 업데이트
       - 생성된 HTML을 DOM에 삽입
2. 재파싱·재렌더링 방식의 문제점
   - 성능 이슈
     - 전체 마크다운 재파싱 필요
     - 전체 DOM 재구성 필요
   - 사용자 경험 저하
     > 스크롤 위치 초기화, 포커스 손실, 깜빡임 등 사용자 경험을 해치는 요소들이 발생
     >
     > 특히 긴 문서에서 이러한 문제가 더욱 두드러짐
3. streaming-markdown 방식의 장점
   - 효율적인 렌더링
     - 증분 파싱(Incremental Parsing)
       1. 변경된 부분만 파싱
       2. 부분적 DOM 업데이트
     - 메모리 효율성
       1. 전체 문서를 메모리에 유지할 필요 없음
       2. 낮은 메모리 사용량




  

  

  
## 매우 복잡한 중첩 표 테스트

| 렌더링 단계 | 재파싱·재렌더링 방식 | streaming-markdown 방식 | 비고 |
|------------|---------------------|------------------------|------|
| **파싱** | 매 업데이트마다 전체 파싱 | 증분 파싱 | |
| ^^ | 시간 복잡도: O(n) | 시간 복잡도: O(1) | n: 문서 길이 |
| ^^ | 메모리 사용: 높음 | 메모리 사용: 낮음 | |
| **DOM 조작** | innerHTML 교체 | 부분 업데이트 | |
| ^^ | 기존 노드 전부 폐기 | 기존 노드 유지 | |
| ^^ | 스크롤 위치 초기화 | 스크롤 위치 유지 | |
| **렌더링** | 브라우저 전체 리플로우 | 최소한의 리플로우 | |
| ^^ | 깜빡임 발생 | 부드러운 전환 | |
| **사용자 경험** | 기본 구현 간단 | 구현 복잡 | |
| ^^ | 긴 문서에서 성능 저하 | 문서 길이에 영향 적음 | |
| ^^ | 입력 지연 발생 | 반응성 유지 | |

## 매우 복잡한 수식 테스트

Einstein의 질량-에너지 등가성 방정식:
\`\`\`
E = mc²
\`\`\`

비즈니스 이익 계산식:
\`\`\`
Profit = Revenue - Cost

Revenue = Price × Quantity
Cost = Fixed Cost + Variable Cost × Quantity
\`\`\`

통계학의 정규분포 확률밀도함수:
\`\`\`
f(x) = (1 / (σ√(2π))) * e^(-(x-μ)²/(2σ²))
\`\`\`

마크다운 렌더링 시간 복잡도:
\`\`\`
재파싱·재렌더링 시간 = O(n)
streaming-markdown 시간 = O(1)

여기서 n은 문서의 전체 길이
\`\`\`

## 마지막 복잡한 이미지와 테이블

![다섯 번째 테스트 이미지](https://picsum.photos/600/300?random=4)


## 마무리

이제 두 가지 마크다운 렌더링 방식의 차이점이 명확하게 보이시나요? 특히 복잡한 차트, 표, 이미지를 포함하는 콘텐츠에서 streaming-markdown 방식의 장점이 두드러집니다.

스트리밍 방식의 차이점은 다음과 같이 요약할 수 있습니다:

1. **성능 차이**: streaming-markdown 방식은 증분 업데이트를 사용하여 훨씬 효율적
2. **사용자 경험**: 깜빡임 없이 부드러운 렌더링 제공
3. **리소스 사용**: 메모리와 CPU 사용량이 현저히 낮음
4. **복잡한 콘텐츠**: 표, 코드 블록, 이미지 등 복잡한 요소에서 차이가 더욱 명확

이 강화된 데모를 통해 두 방식의 차이를 명확하게 비교할 수 있을 것입니다.
`;

onMounted(() => {
  // streaming-markdown 파서 초기화
  initializeParser();
  
  // 자동으로 스트리밍 시작
  startStreaming();
});

onUnmounted(() => {
  // 컴포넌트가 언마운트될 때 인터벌 정리
  if (streamInterval) {
    clearInterval(streamInterval);
  }
});

// 파서 초기화 함수
function initializeParser() {
  if (streamingElement.value) {
    // streaming-markdown 사용법에 맞게 렌더러와 파서 생성
    const renderer = smd.default_renderer(streamingElement.value);
    parser = smd.parser(renderer);
  }
}

// 스트리밍 시작 함수
function startStreaming() {
  // 이미 스트리밍 중이면 실행하지 않음
  if (isStreaming.value) return;
  
  // 스트리밍 상태 초기화
  isStreaming.value = true;
  streamingContent.value = '';
  progress.value = 0;
  
  // 기존 스트리밍이 있다면 중지
  if (streamInterval) {
    clearInterval(streamInterval);
  }
  
  // 컨텐츠 영역 초기화
  if (rerenderElement.value) {
    rerenderElement.value.innerHTML = '';
  }
  
  if (streamingElement.value) {
    streamingElement.value.innerHTML = '';
    
    // 파서 재초기화
    const renderer = smd.default_renderer(streamingElement.value);
    parser = smd.parser(renderer);
  }
  
  // 문자별로 분할하여 왼쪽에서 오른쪽으로 나타나도록 함
  const characters = simulatedLLMResponse.split('');
  const totalChars = characters.length;
  let currentIndex = 0;
  
  streamInterval = setInterval(() => {
    if (currentIndex < totalChars) {
      // 현재 문자를 추가
      const char = characters[currentIndex];
      streamingContent.value += char;
      
      // 1. 재파싱·재렌더링 방식 (왼쪽)
      if (rerenderElement.value) {
        rerenderElement.value.innerHTML = marked.parse(streamingContent.value);
      }
      
      // 2. streaming-markdown 방식 (오른쪽)
      if (parser) {
        smd.parser_write(parser, char);
      }
      
      // 진행 상태 업데이트
      currentIndex++;
      progress.value = Math.floor((currentIndex / totalChars) * 100);
    } else {
      // 스트리밍 완료
      clearInterval(streamInterval);
      isStreaming.value = false;
      
      // streaming-markdown 파서 종료
      if (parser) {
        smd.parser_end(parser);
      }
      
      console.log('스트리밍 완료!');
    }
  }, 20); // 20ms 간격으로 문자 추가 (타이핑 속도)
}
</script>












<template>
  <div class="comparison-demo">
    <h1>마크다운 렌더링 방식 비교 - 강화 데모</h1>
    
    <div class="explanation">
      <p>이 데모는 두 가지 마크다운 렌더링 방식을 복잡한 콘텐츠로 실시간 비교합니다:</p>
      <ul>
        <li><strong style="color:#d32f2f">재파싱·재렌더링 방식</strong>: 매 문자마다 전체 마크다운을 재파싱하고 전체 DOM을 교체합니다.</li>
        <li><strong style="color:#1a73e8">streaming-markdown 방식</strong>: 부분 DOM 패치를 사용하여 변경된 부분만 업데이트합니다.</li>
      </ul>
      <p><em>특별히 복잡한 차트, 표, 이미지와 중첩 구조를 포함하여 두 방식의 차이를 명확히 보여줍니다.</em></p>
    </div>
    
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
      <div class="progress-text">{{ progress }}% 완료</div>
    </div>
    
    <div class="controls">
      <button @click="startStreaming" :disabled="isStreaming">
        {{ isStreaming ? '스트리밍 중...' : '스트리밍 시작' }}
      </button>
    </div>
    
    <div class="comparison-container">
      <div class="rerender-container">
        <h2>재파싱·재렌더링 방식</h2>
        <div class="content-box">
          <div ref="rerenderElement" class="content"></div>
        </div>
        <div class="info">
          <ul>
            <li>매 문자마다 전체 마크다운 재파싱</li>
            <li>innerHTML을 통한 DOM 전체 교체</li>
            <li>텍스트가 길어질수록 성능 저하</li>
            <li>복잡한 요소에서 깜빡임 명확</li>
          </ul>
        </div>
      </div>
      
      <div class="streaming-container">
        <h2>streaming-markdown 방식</h2>
        <div class="content-box">
          <div ref="streamingElement" class="content"></div>
        </div>
        <div class="info">
          <ul>
            <li>부분적 DOM 패치 적용</li>
            <li>변경된 부분만 업데이트</li>
            <li>효율적인 메모리 및 CPU 사용</li>
            <li>복잡한 요소도 부드럽게 렌더링</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="observation-points">
      <h3>🔍 관찰 포인트</h3>
      <ol>
        <li>복잡한 표가 렌더링될 때 깜빡임 차이</li>
        <li>여러 이미지가 순차적으로 로드될 때의 차이</li>
        <li>SVG 차트와 ASCII 아트 차트 렌더링 방식 차이</li>
        <li>중첩된 리스트와 인용구의 렌더링 차이</li>
        <li>스크롤 위치 유지 여부 확인</li>
      </ol>
    </div>
    
    <div class="raw-markdown">
      <h3>원시 마크다운 (현재 스트리밍 진행 상태):</h3>
      <pre>{{ streamingContent }}</pre>
    </div>
  </div>
</template>

<style scoped>
.comparison-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
}

h2 {
  margin-top: 0;
  padding: 10px;
  font-size: 18px;
  background-color: #f5f5f5;
  border-radius: 4px 4px 0 0;
}

.progress-container {
  margin: 20px 0;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #eee;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4285f4;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: right;
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.controls {
  margin-bottom: 20px;
  text-align: center;
}

button {
  padding: 8px 16px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  min-width: 150px;
}

button:hover {
  background-color: #3367d6;
}

button:disabled {
  background-color: #a9c8fd;
  cursor: not-allowed;
}

.comparison-container {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.rerender-container,
.streaming-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.content-box {
  flex: 1;
  padding: 16px;
  min-height: 800px; /* 높이 증가 */
  background-color: #f9f9f9;
  overflow-y: auto;
  position: relative;
}

.content {
  line-height: 1.6;
}

/* 향상된 마크다운 요소 스타일링 */
.content :deep(pre) {
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 14px;
}

.content :deep(code) {
  font-family: 'Consolas', 'Monaco', monospace;
  background-color: #f5f5f5;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 0.9em;
}

.content :deep(blockquote) {
  border-left: 4px solid #ccc;
  padding-left: 16px;
  margin-left: 0;
  color: #666;
  background-color: #fafafa;
}

.info {
  background-color: #f5f5f5;
  padding: 10px 15px;
  font-size: 14px;
}

.info ul {
  margin: 5px 0;
  padding-left: 20px;
}

.info li {
  margin-bottom: 5px;
}

.rerender-container {
  border-color: #d32f2f;
}

.rerender-container .info {
  background-color: #feeded;
}

.rerender-container h2 {
  background-color: #ffcccc;
  color: #d32f2f;
}

.streaming-container {
  border-color: #1a73e8;
}

.streaming-container .info {
  background-color: #e8f0fe;
}

.streaming-container h2 {
  background-color: #cce0ff;
  color: #1a73e8;
}

/* 표 스타일 개선 */
.content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 15px 0;
  border: 1px solid #ddd;
}

.content :deep(th), 
.content :deep(td) {
  padding: 8px 12px;
  border: 1px solid #ddd;
  text-align: left;
}

.content :deep(th) {
  background-color: #f0f0f0;
  font-weight: bold;
}

.content :deep(tr:nth-child(even)) {
  background-color: #f9f9f9;
}

/* 이미지 스타일 */
.content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin: 10px 0;
  display: block;
}

/* 관찰 포인트 스타일 */
.observation-points {
  background-color: #fff8e1;
  border: 1px solid #ffe082;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
}

.observation-points h3 {
  margin-top: 0;
  color: #f57f17;
}

.observation-points ol {
  margin: 10px 0 5px 25px;
  padding: 0;
}

.observation-points li {
  margin-bottom: 8px;
  line-height: 1.4;
}

/* 설명 섹션 스타일 개선 */
.explanation {
  background-color: #f8f9fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
  font-size: 15px;
  line-height: 1.5;
}

.explanation ul {
  margin: 10px 0 5px 20px;
  padding: 0;
}

.explanation li {
  margin-bottom: 5px;
}

.raw-markdown {
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.raw-markdown pre {
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  white-space: pre-wrap;
  font-size: 14px;
  max-height: 200px;
  overflow-y: auto;
}

/* 헤더 강조 스타일 */
.content :deep(h1), 
.content :deep(h2), 
.content :deep(h3), 
.content :deep(h4), 
.content :deep(h5) {
  margin-top: 25px;
  margin-bottom: 15px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.content :deep(h1) {
  font-size: 24px;
}

.content :deep(h2) {
  font-size: 22px;
}

.content :deep(h3) {
  font-size: 20px;
}

.content :deep(h4) {
  font-size: 18px;
}

/* 링크 스타일 */
.content :deep(a) {
  color: #1a73e8;
  text-decoration: none;
}

.content :deep(a:hover) {
  text-decoration: underline;
}
</style>