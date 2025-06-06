# Dãy số Fibonacci

## Định nghĩa

Dãy số Fibonacci được định nghĩa như sau:

$$F_0 = 0, F_1 = 1, F_n = F_{n-1} + F_{n-2}$$

Các phần tử đầu tiên của dãy ([OEIS A000045](http://oeis.org/A000045)) là:

$$0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ...$$

## Tính chất

Các số Fibonacci có rất nhiều tính chất thú vị. Dưới đây là một số trong số chúng:

### Đẳng thức Cassini

$$F_{n-1} F_{n+1} - F_n^2 = (-1)^n$$

Đẳng thức này có thể được chứng minh bằng quy nạp. Một chứng minh một dòng của Knuth đến từ việc tính định thức của dạng ma trận 2x2 dưới đây.

### Quy tắc "cộng"

$$F_{n+k} = F_k F_{n+1} + F_{k-1} F_n$$

### Áp dụng đẳng thức trước cho trường hợp $k = n$

$$F_{2n} = F_n (F_{n+1} + F_{n-1})$$

Từ đây ta có thể chứng minh bằng quy nạp rằng với bất kỳ số nguyên dương $k$ nào, $F_{nk}$ là bội của $F_n$.

Điều ngược lại cũng đúng: nếu $F_m$ là bội của $F_n$, thì $m$ là bội của $n$.

### Đẳng thức GCD

$$GCD(F_m, F_n) = F_{GCD(m, n)}$$

Các số Fibonacci là đầu vào tồi tệ nhất cho thuật toán Euclid (xem định lý Lamé trong [thuật toán Euclid](https://cp-algorithms.com/algebra/euclid-algorithm.html))

## Mã hóa Fibonacci

Chúng ta có thể sử dụng dãy số để mã hóa các số nguyên dương thành các từ mã nhị phân. Theo định lý Zeckendorf, bất kỳ số tự nhiên $n$ nào đều có thể được biểu diễn duy nhất dưới dạng tổng các số Fibonacci:

$$N = F_{k_1} + F_{k_2} + \ldots + F_{k_r}$$

sao cho $k_1 \ge k_2 + 2,\ k_2 \ge k_3 + 2,\ \ldots,\ k_r \ge 2$ (tức là: biểu diễn không thể sử dụng hai số Fibonacci liên tiếp).

Từ đó suy ra rằng bất kỳ số nào đều có thể được mã hóa duy nhất trong mã hóa Fibonacci. Và chúng ta có thể mô tả biểu diễn này với mã nhị phân $d_0 d_1 d_2 \dots d_s 1$, trong đó $d_i$ là $1$ nếu $F_{i+2}$ được sử dụng trong biểu diễn. Mã sẽ được thêm một $1$ để chỉ ra sự kết thúc của từ mã. Lưu ý rằng đây là trường hợp duy nhất mà hai bit 1 liên tiếp xuất hiện.

$$\begin{eqnarray} 
1 &=& 1 &=& F_2 &=& (11)_F \\ 
2 &=& 2 &=& F_3 &=& (011)_F \\
6 &=& 5 + 1 &=& F_5 + F_2 &=& (10011)_F \\ 
8 &=& 8 &=& F_6 &=& (000011)_F \\ 
9 &=& 8 + 1 &=& F_6 + F_2 &=& (100011)_F \\ 
19 &=& 13 + 5 + 1 &=& F_7 + F_5 + F_2 &=& (1001011)_F 
\end{eqnarray}$$

Việc mã hóa một số nguyên $n$ có thể được thực hiện bằng một thuật toán tham lam đơn giản:

1. Lặp qua các số Fibonacci từ lớn nhất đến nhỏ nhất cho đến khi bạn tìm thấy một số nhỏ hơn hoặc bằng $n$.
2. Giả sử số này là $F_i$. Trừ $F_i$ từ $n$ và đặt $1$ ở vị trí $i-2$ của từ mã (đánh chỉ số từ 0 từ trái sang phải).
3. Lặp lại cho đến khi không còn phần dư.
4. Thêm $1$ cuối cùng vào từ mã để chỉ ra sự kết thúc.

Để giải mã một từ mã, trước tiên loại bỏ $1$ cuối cùng. Sau đó, nếu bit thứ $i$ được đặt (đánh chỉ số từ 0 từ trái sang phải), cộng $F_{i+2}$ vào số.

## Công thức cho số Fibonacci thứ $n$

### Biểu thức dạng đóng

Có một công thức được biết đến với tên "công thức Binet", mặc dù nó đã được Moivre biết đến trước đó:

$$F_n = \frac{\left(\frac{1 + \sqrt{5}}{2}\right)^n - \left(\frac{1 - \sqrt{5}}{2}\right)^n}{\sqrt{5}}$$

Công thức này dễ dàng chứng minh bằng quy nạp, nhưng nó có thể được suy ra với sự trợ giúp của khái niệm hàm sinh hoặc bằng cách giải một phương trình hàm.

Bạn có thể ngay lập tức nhận thấy rằng giá trị tuyệt đối của số hạng thứ hai luôn nhỏ hơn $1$, và nó cũng giảm rất nhanh (theo cấp số nhân). Do đó giá trị của số hạng đầu tiên đơn lẻ "gần như" là $F_n$. Điều này có thể được viết một cách chặt chẽ là:

$$F_n = \left[\frac{\left(\frac{1 + \sqrt{5}}{2}\right)^n}{\sqrt{5}}\right]$$

trong đó dấu ngoặc vuông biểu thị làm tròn đến số nguyên gần nhất.

Vì hai công thức này yêu cầu độ chính xác rất cao khi làm việc với số thực, chúng ít hữu ích trong tính toán thực tế.

### Fibonacci trong thời gian tuyến tính

Số Fibonacci thứ $n$ có thể dễ dàng tìm được trong $O(n)$ bằng cách tính các số một cách lần lượt đến $n$. Tuy nhiên, cũng có những cách nhanh hơn, như chúng ta sẽ thấy.

Chúng ta có thể bắt đầu từ một cách tiếp cận lặp, để tận dụng việc sử dụng công thức $F_n = F_{n-1} + F_{n-2}$, do đó, chúng ta sẽ đơn giản tính trước những giá trị đó trong một mảng. Tính đến các trường hợp cơ sở cho $F_0$ và $F_1$.

```cpp
int fib(int n) {
    int a = 0;
    int b = 1;
    for (int i = 0; i < n; i++) {
        int tmp = a + b;
        a = b;
        b = tmp;
    }
    return a;
}
```

**Python:**
```python
def fib(n):
    a = 0
    b = 1
    for i in range(n):
        a, b = b, a + b
    return a
```

Bằng cách này, chúng ta có được một giải pháp tuyến tính, thời gian $O(n)$, lưu tất cả các giá trị trước $n$ trong dãy.

### Dạng ma trận

Để đi từ $(F_n, F_{n-1})$ đến $(F_{n+1}, F_n)$, chúng ta có thể biểu diễn quan hệ truy hồi tuyến tính dưới dạng phép nhân ma trận 2x2:

$$\begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix} \begin{pmatrix} F_n \\ F_{n-1} \end{pmatrix} = \begin{pmatrix} F_n + F_{n-1} \\ F_{n} \end{pmatrix} = \begin{pmatrix} F_{n+1} \\ F_{n} \end{pmatrix}$$

Điều này cho phép chúng ta coi việc lặp quan hệ truy hồi như phép nhân ma trận lặp đi lặp lại, có những tính chất tốt. Đặc biệt:

$$\begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^n \begin{pmatrix} F_1 \\ F_0 \end{pmatrix} = \begin{pmatrix} F_{n+1} \\ F_{n} \end{pmatrix}$$

trong đó $F_1 = 1, F_0 = 0$. Thực tế, vì:

$$\begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix} = \begin{pmatrix} F_2 & F_1 \\ F_1 & F_0 \end{pmatrix}$$

chúng ta có thể sử dụng ma trận trực tiếp:

$$\begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^n = \begin{pmatrix} F_{n+1} & F_n \\ F_n & F_{n-1} \end{pmatrix}$$

Do đó, để tìm $F_n$ trong thời gian $O(\log n)$, chúng ta phải nâng ma trận lên lũy thừa n. (Xem [lũy thừa nhị phân](https://cp-algorithms.com/algebra/binary-exp.html))

```cpp
struct matrix {
    long long mat[2][2];
    matrix friend operator *(const matrix &a, const matrix &b){
        matrix c;
        for (int i = 0; i < 2; i++) {
          for (int j = 0; j < 2; j++) {
              c.mat[i][j] = 0;
              for (int k = 0; k < 2; k++) {
                  c.mat[i][j] += a.mat[i][k] * b.mat[k][j];
              }
          }
        }
        return c;
    }
};

matrix matpow(matrix base, long long n) {
    matrix ans{ {
      {1, 0},
      {0, 1}
    } };
    while (n) {
        if(n&1)
            ans = ans*base;
        base = base*base;
        n >>= 1;
    }
    return ans;
}

long long fib(int n) {
    matrix base{ {
      {1, 1},
      {1, 0}
    } };
    return matpow(base, n).mat[0][1];
}
```

**Python:**
```python
def matrix_mult(A, B):
    """Nhân hai ma trận 2x2"""
    return [
        [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
        [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]
    ]

def matrix_power(base, n):
    """Tính lũy thừa ma trận"""
    ans = [[1, 0], [0, 1]]  # Ma trận đơn vị
    while n:
        if n & 1:
            ans = matrix_mult(ans, base)
        base = matrix_mult(base, base)
        n >>= 1
    return ans

def fib_matrix(n):
    """Tính Fibonacci sử dụng phương pháp ma trận"""
    if n == 0:
        return 0
    base = [[1, 1], [1, 0]]
    result = matrix_power(base, n)
    return result[0][1]
```

### Phương pháp nhân đôi nhanh

Bằng cách mở rộng biểu thức ma trận trên cho $n = 2\cdot k$:

$$\begin{pmatrix} F_{2k+1} & F_{2k}\\ F_{2k} & F_{2k-1} \end{pmatrix} = \begin{pmatrix} 1 & 1\\ 1 & 0 \end{pmatrix}^{2k} = \begin{pmatrix} F_{k+1} & F_{k}\\ F_{k} & F_{k-1} \end{pmatrix} ^2$$

chúng ta có thể tìm thấy những phương trình đơn giản hơn này:

$$\begin{align} 
F_{2k+1} &= F_{k+1}^2 + F_{k}^2 \\ 
F_{2k} &= F_k(F_{k+1}+F_{k-1}) = F_k (2F_{k+1} - F_{k})\\ 
\end{align}$$

Do đó, sử dụng hai phương trình trên, các số Fibonacci có thể được tính dễ dàng bằng mã sau:

```cpp
pair<int, int> fib (int n) {
    if (n == 0)
        return {0, 1};

    auto p = fib(n >> 1);
    int c = p.first * (2 * p.second - p.first);
    int d = p.first * p.first + p.second * p.second;
    if (n & 1)
        return {d, c + d};
    else
        return {c, d};
}
```

**Python:**
```python
def fib_fast(n):
    """Phương pháp nhân đôi nhanh tính Fibonacci"""
    if n == 0:
        return (0, 1)
    
    f_k, f_k1 = fib_fast(n >> 1)
    c = f_k * (2 * f_k1 - f_k)
    d = f_k * f_k + f_k1 * f_k1
    
    if n & 1:
        return (d, c + d)
    else:
        return (c, d)

def fib_nth(n):
    """Trả về F_n"""
    return fib_fast(n)[0]
```

Mã trên trả về $F_n$ và $F_{n+1}$ dưới dạng một cặp.

## Tính tuần hoàn modulo p

Xét dãy Fibonacci modulo $p$. Chúng ta sẽ chứng minh dãy này là tuần hoàn.

Hãy chứng minh điều này bằng phản chứng. Xét $p^2 + 1$ cặp số Fibonacci đầu tiên lấy modulo $p$:

$$(F_0,\ F_1),\ (F_1,\ F_2),\ \ldots,\ (F_{p^2},\ F_{p^2 + 1})$$

Chỉ có thể có $p$ số dư khác nhau modulo $p$, và nhiều nhất $p^2$ cặp số dư khác nhau, vậy có ít nhất hai cặp giống hệt nhau trong số chúng. Điều này đủ để chứng minh dãy là tuần hoàn, vì một số Fibonacci chỉ được xác định bởi hai số tiền nhiệm của nó. Do đó nếu hai cặp số liên tiếp lặp lại, điều đó cũng có nghĩa là các số sau cặp sẽ lặp lại theo cùng một cách.

Bây giờ chúng ta chọn hai cặp số dư giống hệt nhau với chỉ số nhỏ nhất trong dãy. Cho các cặp là $(F_a,\ F_{a + 1})$ và $(F_b,\ F_{b + 1})$. Chúng ta sẽ chứng minh rằng $a = 0$. Nếu điều này sai, sẽ có hai cặp trước đó $(F_{a-1},\ F_a)$ và $(F_{b-1},\ F_b)$, mà theo tính chất của các số Fibonacci, cũng sẽ bằng nhau. Tuy nhiên, điều này mâu thuẫn với thực tế là chúng ta đã chọn các cặp với chỉ số nhỏ nhất, hoàn thành chứng minh rằng không có tiền kỳ (tức là các số tuần hoàn bắt đầu từ $F_0$).

## Bài tập thực hành

• [SPOJ - Euclid Algorithm Revisited](http://www.spoj.com/problems/MAIN74/)
• [SPOJ - Fibonacci Sum](http://www.spoj.com/problems/FIBOSUM/)
• [HackerRank - Is Fibo](https://www.hackerrank.com/challenges/is-fibo/problem)
• [Project Euler - Even Fibonacci numbers](https://www.hackerrank.com/contests/projecteuler/challenges/euler002/problem)
• [DMOJ - Fibonacci Sequence](https://dmoj.ca/problem/fibonacci)
• [DMOJ - Fibonacci Sequence (Harder)](https://dmoj.ca/problem/fibonacci2)
• [DMOJ UCLV - Numbered sequence of pencils](https://dmoj.uclv.edu.cu/problem/secnum)
• [DMOJ UCLV - Fibonacci 2D](https://dmoj.uclv.edu.cu/problem/fibonacci)
• [DMOJ UCLV - fibonacci calculation](https://dmoj.uclv.edu.cu/problem/fibonaccicalculatio)
• [LightOJ - Number Sequence](https://lightoj.com/problem/number-sequence)
• [Codeforces - C. Fibonacci](https://codeforces.com/problemset/gymProblem/102644/C)
• [Codeforces - A. Hexadecimal's theorem](https://codeforces.com/problemset/problem/199/A)
• [Codeforces - B. Blackboard Fibonacci](https://codeforces.com/problemset/problem/217/B)
• [Codeforces - E. Fibonacci Number](https://codeforces.com/problemset/problem/193/E)

## Tài liệu tham khảo

Bài viết này được dịch từ [CP-Algorithms](https://cp-algorithms.com/algebra/fibonacci-numbers.html) với các thuật ngữ chuyên ngành được dịch chính xác sang tiếng Việt.
